import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const AccessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("timestamp");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const logsPerPage = 50;

  // Adjust endDate to include the full day
  const adjustedEndDate = endDate
    ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
        .toISOString()
        .split("T")[0]
    : null;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:5001/api/access-logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            sort: sortOption,
            startDate,
            endDate: adjustedEndDate,
          },
        }
      );

      setLogs(response.data.logs || []);
      setTotalPages(Math.ceil((response.data.totalLogs || 0) / logsPerPage));
    } catch (error) {
      console.error("Failed to load logs:", error);
      alert("Error fetching logs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortOption, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateReport = async () => {
    setReportLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:5001/api/generate-report",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            startDate,
            endDate: adjustedEndDate,
          },
        }
      );

      const reportBlob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(reportBlob);
      downloadLink.download = `AccessLogs_Report_${startDate || "all"}_to_${
        endDate || "all"
      }.json`;
      downloadLink.click();
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Error generating report. Please try again later.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Access Logs</h2>

      {/* Search and Sorting */}
      <div className="d-flex mt-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search logs by user, role, or action"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setSearchTerm("")}
          className="btn btn-secondary ms-2"
        >
          Reset
        </button>
        <select
          className="form-select ms-2"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="timestamp">Sort by Timestamp</option>
          <option value="user">Sort by User</option>
          <option value="role">Sort by Role</option>
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="d-flex mt-3">
        <input
          type="date"
          className="form-control me-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchLogs} className="btn btn-primary ms-2">
          Filter
        </button>
      </div>

      {/* Generate Report */}
      <div className="d-flex mt-3">
        <button
          onClick={generateReport}
          className="btn btn-success ms-2"
          disabled={reportLoading}
        >
          {reportLoading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && <p className="text-center mt-4">Loading logs...</p>}

      {/* Display Logs */}
      <div className="mt-4">
        {!loading && logs.length > 0 ? (
          <ul className="list-group">
            {logs.map((log) => (
              <li key={log.log_id} className="list-group-item">
                <strong>ID:</strong> {log.role_id || "N/A"} -{" "}
                <strong>User:</strong> {log.user_name || "Unknown"} -{" "}
                <strong>Role:</strong> {log.role || "N/A"} -{" "}
                <strong>Action:</strong> {log.action || "N/A"} -{" "}
                <strong>Timestamp:</strong> {log.timestamp}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-center text-muted">No logs found.</p>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button onClick={() => paginate(i + 1)} className="page-link">
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default AccessLogs;
