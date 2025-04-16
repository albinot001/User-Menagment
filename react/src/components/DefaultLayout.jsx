import { useEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axios_client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import "../index.css";
export default function DefaultLayout() {
  const { user, token, setToken, setUser, notification } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (event) => {
    event.preventDefault();

    axiosClient.post("/logout").then(() => {
      setToken(null);
      setUser({});
    });
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
      </aside>
      <div className="content">
        <header>
          <div>Header</div>
        </header>
        <header>
          <div>{user.name}</div>
          <a href="#" onClick={onLogout} className="btn-logout">
            Logout
          </a>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}
