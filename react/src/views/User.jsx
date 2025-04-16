import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios_client";
import { useStateContext } from "../contexts/ContextProvider";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get("/users")
      .then(({ data }) => {
        setTimeout(() => {
          setLoading(false);
          setUsers(data.data);
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          console.log(error);
          setLoading(false);
        }, 1000);
      });
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axiosClient.delete(`/users/${id}`).then(() => {
        setNotification("User was successfully deleted");
        getUsers();
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
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created at</th>
              <th>Actions</th>
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
        </div>
      </div>
    </div>
  );
}
