import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import "./Auth.css";


function Login() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    login,
  } = useAuth();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      if (
        !email.trim() ||
        !password
      ) {
        setError(
          "Please enter your email and password."
        );

        return;
      }

      try {
        setLoading(true);

        await login({
          email,
          password,
        });

        const destination =
          location.state
            ?.from ||
          "/app";

        navigate(
          destination,
          {
            replace: true,
          }
        );
      } catch (error) {
        setError(
          error.message ||
            "Login failed."
        );
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          NetViz
        </div>

        <h1>
          Welcome back
        </h1>

        <p className="auth-subtitle">
          Sign in to your NetViz account
        </p>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="you@example.com"
            autoComplete="email"
          />


          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="Enter your password"
            autoComplete="current-password"
          />


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>


        <p className="auth-switch">
          Don't have a NetViz account?

          {" "}

          <Link to="/register">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}


export default Login;