import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios_client.js";
import { useStateContext } from "../contexts/ContextProvider";

export default function Login() {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setUser, setToken } = useStateContext();

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(null);
    setLoading(true);

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        setTimeout(() => {
          setUser(data.user);
          setToken(data.token);
        }, 3000);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors);
          } else {
            setErrors({
              email: [response.data.message],
            });
          }
        }
        setLoading(false);
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <div className="title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="logo-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1>Welcome Back</h1>
          <p>Please sign in to your account</p>
        </div>

        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              ref={emailRef}
              type="email"
              id="email"
              placeholder="name@company.com"
              disabled={loading}
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
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button className="btn btn-block" disabled={loading}>
            {loading ? (
              <span className="button-loading">
                <div className="loading-spinner"></div>
                {errors ? "Try again..." : "Signing in..."}
              </span>
            ) : (
              "Sign in to your account"
            )}
          </button>

          <p className="message">
            Not registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
