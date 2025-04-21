import { useEffect, useState } from "react";
import axiosClient from "../axios_client";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserProfile() {
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
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      }
    } finally {
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
        <h2>Profile Settings</h2>
      </div>
      <div className="card-body">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="form-control"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              className="form-control"
            />
          </div>

          <div className="password-section">
            <h3>Change Password</h3>
            <p className="text-secondary">
              Leave blank if you don't want to change your password
            </p>

            <div className="input-group">
              <label htmlFor="current_password">Current Password</label>
              <input
                id="current_password"
                name="current_password"
                type="password"
                value={formData.current_password}
                onChange={handleChange}
                placeholder="Current password"
                className="form-control"
              />
            </div>

            <div className="input-group">
              <label htmlFor="new_password">New Password</label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="New password"
                className="form-control"
              />
            </div>

            <div className="input-group">
              <label htmlFor="new_password_confirmation">
                Confirm New Password
              </label>
              <input
                id="new_password_confirmation"
                name="new_password_confirmation"
                type="password"
                value={formData.new_password_confirmation}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="form-control"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-block" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
