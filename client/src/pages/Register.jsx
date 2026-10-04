import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import "./Auth.css";


function Register() {
  const navigate =
    useNavigate();

  const {
    register,
  } = useAuth();


  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
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
        !name.trim() ||
        !email.trim() ||
        !password ||
        !confirmPassword
      ) {
        setError(
          "Please fill in all fields."
        );

        return;
      }


      if (
        password !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }


      if (
        password.length < 6
      ) {
        setError(
          "Password must contain at least 6 characters."
        );

        return;
      }


      try {
        setLoading(true);

        await register({
          name,
          email,
          password,
        });

        navigate(
          "/app",
          {
            replace: true,
          }
        );
      } catch (error) {
        setError(
          error.message ||
            "Registration failed."
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
          Create your account
        </h1>

        <p className="auth-subtitle">
          Start building and simulating networks
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
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            placeholder="Your name"
            autoComplete="name"
          />


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
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
          />


          <label>
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>


        <p className="auth-switch">
          Already have an account?

          {" "}

          <Link to="/">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}


export default Register;