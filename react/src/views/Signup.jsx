import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios_client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useStateContext();


  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };
    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch(({ response }) => {
        if (response.status === 422) {
          setErrors(response.data.errors);

        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <div className="title">
          <div className="logo-wrapper">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1>Create Account</h1>
          <p>Join our community and start managing users</p>
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
              Full Name
            </label>
            <input ref={nameRef} type="text" id="name" placeholder="John Doe" />
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
              Email Address
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              placeholder="john@example.com"
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
            />
          </div>

          <div className="input-group">
            <label htmlFor="passwordConfirmation">
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
              Confirm Password
            </label>
            <input
              ref={passwordConfirmationRef}
              type="password"
              id="passwordConfirmation"
              placeholder="••••••••"
            />
          </div>

          <button className="btn btn-block">
            <span>Create Account</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="button-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          <p className="message">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
