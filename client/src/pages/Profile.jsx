import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  changePassword,
  updateProfile,
} from "../services/authService";

import "./Profile.css";


function Profile() {
  const navigate =
    useNavigate();

  const {
    user,
    token,
    setUser,
  } = useAuth();


  const [name, setName] =
    useState(
      user?.name || ""
    );

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [profileMessage, setProfileMessage] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [savingPassword, setSavingPassword] =
    useState(false);


  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleProfileUpdate =
    async (event) => {
      event.preventDefault();

      setProfileMessage("");
      setError("");

      try {
        setSavingProfile(true);

        const data =
          await updateProfile({
            token,
            name,
          });

        setUser(
          data.user
        );

        setProfileMessage(
          "Profile updated successfully."
        );
      } catch (error) {
        setError(
          error.message ||
            "Failed to update profile."
        );
      } finally {
        setSavingProfile(false);
      }
    };


  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handlePasswordChange =
    async (event) => {
      event.preventDefault();

      setPasswordMessage("");
      setError("");


      if (
        newPassword !==
        confirmPassword
      ) {
        setError(
          "New passwords do not match."
        );

        return;
      }


      if (
        newPassword.length < 6
      ) {
        setError(
          "New password must contain at least 6 characters."
        );

        return;
      }


      try {
        setSavingPassword(true);

        const data =
          await changePassword({
            token,
            currentPassword,
            newPassword,
          });

        setPasswordMessage(
          data.message ||
            "Password changed successfully."
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        setError(
          error.message ||
            "Failed to change password."
        );
      } finally {
        setSavingPassword(false);
      }
    };


  return (
    <div className="profile-page">

      <div className="profile-container">

        <button
          type="button"
          className="profile-back"
          onClick={() =>
            navigate("/app")
          }
        >
          ← Back to NetViz
        </button>


        <div className="profile-header">

          <div className="profile-avatar">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() ||
              "U"}
          </div>

          <div>
            <h1>
              My Profile
            </h1>

            <p>
              Manage your NetViz account
            </p>
          </div>

        </div>


        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}


        {/* =================================================
            ACCOUNT DETAILS
            ================================================= */}

        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <h2>
                Account Details
              </h2>

              <p>
                Your basic NetViz account information.
              </p>
            </div>
          </div>


          <form
            onSubmit={
              handleProfileUpdate
            }
          >

            <div className="profile-grid">

              <div className="profile-field">

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
                />

              </div>


              <div className="profile-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    user?.email || ""
                  }
                  disabled
                />

              </div>


              <div className="profile-field">

                <label>
                  Role
                </label>

                <input
                  type="text"
                  value={
                    user?.role || "user"
                  }
                  disabled
                />

              </div>


              <div className="profile-field">

                <label>
                  Member Since
                </label>

                <input
                  type="text"
                  value={
                    user?.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : ""
                  }
                  disabled
                />

              </div>

            </div>


            <button
              type="submit"
              className="profile-save"
              disabled={
                savingProfile
              }
            >
              {savingProfile
                ? "Saving..."
                : "Save Profile"}
            </button>

          </form>


          {profileMessage && (
            <div className="profile-success">
              {profileMessage}
            </div>
          )}

        </section>


        {/* =================================================
            PASSWORD
            ================================================= */}

        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <h2>
                Change Password
              </h2>

              <p>
                Update your NetViz account password.
              </p>
            </div>
          </div>


          <form
            onSubmit={
              handlePasswordChange
            }
          >

            <div className="profile-password-fields">

              <div className="profile-field">

                <label>
                  Current Password
                </label>

                <input
                  type="password"
                  value={
                    currentPassword
                  }
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                />

              </div>


              <div className="profile-field">

                <label>
                  New Password
                </label>

                <input
                  type="password"
                  value={
                    newPassword
                  }
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                />

              </div>


              <div className="profile-field">

                <label>
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                />

              </div>

            </div>


            <button
              type="submit"
              className="profile-save"
              disabled={
                savingPassword
              }
            >
              {savingPassword
                ? "Changing..."
                : "Change Password"}
            </button>

          </form>


          {passwordMessage && (
            <div className="profile-success">
              {passwordMessage}
            </div>
          )}

        </section>

      </div>

    </div>
  );
}


export default Profile;