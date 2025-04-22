import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios_client";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    new_users_today: 0,
    new_users_this_week: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStats();
    getRecentUsers();
    getUserActivity();

    const interval = setInterval(() => {
      if (!loading) {
        getStats();
        getRecentUsers();
        getUserActivity();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [loading]);

  const getStats = () => {
    axiosClient
      .get("/dashboard/stats")
      .then(({ data }) => {
        setStats(data);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
      });
  };

  const getRecentUsers = () => {
    axiosClient
      .get("/dashboard/recent-users")
      .then(({ data }) => {
        setRecentUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching recent users:", error);
      });
  };

  const getUserActivity = () => {
    console.log("Fetching user activities...");
    axiosClient
      .get("/dashboard/user-activity")
      .then(({ data }) => {
        console.log("Received activities:", data);
        if (Array.isArray(data)) {
          setUserActivity(data);
          setError(null);
        } else if (data.error) {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching user activity:",
          error.response?.data || error.message
        );
        setError("Failed to load activities");
        setLoading(false);
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <Link to="/users/new" className="btn-add">
          Add New User
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3>Total Users</h3>
          <div className="value">{stats.total_users}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3>Active Users</h3>
          <div className="value">{stats.active_users}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon new-today-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3>New Today</h3>
          <div className="value">{stats.new_users_today}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon new-week-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3>This Week</h3>
          <div className="value">{stats.new_users_this_week}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Users</h2>
            <Link to="/users" className="btn-text">
              View All
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <Link to={`/users/${user.id}`} className="btn-edit">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="card-body">
            {error ? (
              <div className="error-message">{error}</div>
            ) : userActivity.length === 0 ? (
              <div className="no-activity">No recent activity</div>
            ) : (
              <div className="activity-list">
                {userActivity.map((activity, index) => (
                  <div key={activity.id || index} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === "created" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon success"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      )}
                      {activity.type === "updated" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon warning"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      )}
                      {activity.type === "deleted" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon danger"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="activity-content">
                      <p>{activity.description}</p>
                      <span className="activity-time">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
