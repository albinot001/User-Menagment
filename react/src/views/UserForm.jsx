import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios_client";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { setNotification } = useStateContext();
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setUser(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setErrors(error.response?.data.errors || {});
        });
    }
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    const payload = { ...user };
    if (!id) {
      // For new user, include password fields
      if (!payload.password) {
        setErrors({
          password: ["Password is required for new users"],
        });
        setLoading(false);
        return;
      }
    } else {
      // For existing user, only include password if it's being changed
      if (!payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }
    }

    const endpoint = id ? `/users/${id}` : "/users";
    const method = id ? "put" : "post";

    axiosClient[method](endpoint, payload)
      .then(() => {
        setNotification(`User was successfully ${id ? "updated" : "created"}`);
        navigate("/users");
      })
      .catch((error) => {
        setLoading(false);
        const response = error.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="card animated fadeInDown">
      <div className="card-header">
        <h2>{id ? `Edit User: ${user.name}` : "Create New User"}</h2>
      </div>
      <div className="card-body">
        {loading && (
          <div className="text-center">
            <div className="loading-spinner"></div>
            <p className="mt-3">Loading...</p>
          </div>
        )}
        {!loading && (
          <form onSubmit={handleSubmit} className="user-form">
            {errors && Object.keys(errors).length > 0 && (
              <div className="alert">
                {Object.keys(errors).map((key) => (
                  <p key={key} className="error-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="error-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors[key][0]}
                  </p>
                ))}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="name">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Name
              </label>
              <input
                id="name"
                type="text"
                value={user.name}
                onChange={(ev) => setUser({ ...user, name: ev.target.value })}
                placeholder="User's full name"
                className={errors.name ? "has-error" : ""}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                placeholder="Email address"
                className={errors.email ? "has-error" : ""}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Password {!id && <span className="required">*</span>}
              </label>
              <input
                id="password"
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password: ev.target.value })
                }
                placeholder={
                  id ? "Leave empty to keep current password" : "Password"
                }
                className={errors.password ? "has-error" : ""}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password_confirmation">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Confirm Password {!id && <span className="required">*</span>}
              </label>
              <input
                id="password_confirmation"
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password_confirmation: ev.target.value })
                }
                placeholder={
                  id
                    ? "Leave empty to keep current password"
                    : "Confirm password"
                }
                className={errors.password_confirmation ? "has-error" : ""}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/users")}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <span className="button-loading">
                    <div className="loading-spinner"></div>
                    Saving...
                  </span>
                ) : (
                  "Save User"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
