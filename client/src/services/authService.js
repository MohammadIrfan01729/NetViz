const API_BASE_URL =
  "http://localhost:5001/api/auth";


// =====================================================
// REGISTER
// =====================================================

export const registerUser = async ({
  name,
  email,
  password,
}) => {
  const response =
    await fetch(
      `${API_BASE_URL}/register`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Registration failed"
    );
  }

  return data;
};


// =====================================================
// LOGIN
// =====================================================

export const loginUser = async ({
  email,
  password,
}) => {
  const response =
    await fetch(
      `${API_BASE_URL}/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Login failed"
    );
  }

  return data;
};


// =====================================================
// GET CURRENT USER
// =====================================================

export const getCurrentUser =
  async (token) => {
    const response =
      await fetch(
        `${API_BASE_URL}/me`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch user"
      );
    }

    return data;
  };


// =====================================================
// UPDATE PROFILE
// =====================================================

export const updateProfile =
  async ({
    token,
    name,
  }) => {
    const response =
      await fetch(
        `${API_BASE_URL}/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to update profile"
      );
    }

    return data;
  };


// =====================================================
// CHANGE PASSWORD
// =====================================================

export const changePassword =
  async ({
    token,
    currentPassword,
    newPassword,
  }) => {
    const response =
      await fetch(
        `${API_BASE_URL}/password`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to change password"
      );
    }

    return data;
  };