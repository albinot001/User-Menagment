import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios_client";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, setUser, setNotification } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
    }));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.current_password) {
      payload.current_password = formData.current_password;
      payload.new_password = formData.new_password;
      payload.new_password_confirmation = formData.new_password_confirmation;
    }

    try {
      const { data } = await axiosClient.put("/user/profile", payload);
      setUser(data.user);
      setNotification("Profile updated successfully!");
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      }));
      // Add a delay to show the loading state
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      }
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="card animated fadeInDown">
      <div className="card-header">
        <h2>{user.name ? `Edit Profile: ${user.name}` : "Profile Settings"}</h2>
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
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={errors.name ? "has-error" : ""}
                disabled={loading}
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
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className={errors.email ? "has-error" : ""}
                disabled={loading}
              />
            </div>

            <div className="password-section">
              <h3>Change Password</h3>
              <p className="text-secondary">
                Leave blank if you don't want to change your password
              </p>

              <div className="input-group">
                <label htmlFor="current_password">
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
                  Current Password
                </label>
                <input
                  id="current_password"
                  name="current_password"
                  type="password"
                  value={formData.current_password}
                  onChange={handleChange}
                  placeholder="Current password"
                  className={errors.current_password ? "has-error" : ""}
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="new_password">
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
                  New Password
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="New password"
                  className={errors.new_password ? "has-error" : ""}
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="new_password_confirmation">
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
                  Confirm New Password
                </label>
                <input
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  type="password"
                  value={formData.new_password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={
                    errors.new_password_confirmation ? "has-error" : ""
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
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
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
