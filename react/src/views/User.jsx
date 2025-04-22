import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios_client";
import { useStateContext } from "../contexts/ContextProvider";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = (page) => {
    setLoading(true);
    axiosClient
      .get(`/users?page=${page}`)
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        setPagination({
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
          per_page: data.meta.per_page,
          total: data.meta.total,
        });
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const onPageChange = (page) => {
    getUsers(page);
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      axiosClient
        .delete(`/users/${id}`)
        .then(() => {
          setNotification("User was successfully deleted");
          getUsers(pagination.current_page);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          setNotification("Error deleting user. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Users</h1>
        <Link to="/users/new" className="btn-add">
          Add new
        </Link>
      </div>
      <div className="card fadeInDown animated">
        <div className="card-body">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Created at</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading && (
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center">
                    Loading...
                  </td>
                </tr>
              </tbody>
            )}
            {!loading && (
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.created_at}</td>
                    <td>
                      <Link to={`/users/${user.id}`} className="btn-edit">
                        Edit
                      </Link>
                      &nbsp;
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          <div className="pagination">
            <div className="pagination-info">
              Showing {users.length} of {pagination.total} users
            </div>
            <div className="pagination-buttons">
              <button
                className="btn-pagination"
                disabled={pagination.current_page === 1}
                onClick={() => onPageChange(pagination.current_page - 1)}
              >
                Previous
              </button>
              {[...Array(pagination.last_page)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`btn-pagination ${
                    pagination.current_page === index + 1 ? "active" : ""
                  }`}
                  onClick={() => onPageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="btn-pagination"
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => onPageChange(pagination.current_page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
