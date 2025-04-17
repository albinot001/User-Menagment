import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios_client.js";
import { useStateContext } from "../contexts/ContextProvider";

export default function Login() {
  const [errors, setErrors] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setUser, setToken } = useStateContext();

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(null);

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
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
            <label htmlFor="email">Email</label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              placeholder="name@company.com"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              placeholder="••••••••"
            />
          </div>

          <button className="btn btn-block">Sign in to your account</button>

          <p className="message">
            Not registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
