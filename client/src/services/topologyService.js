const API_BASE_URL =
  "http://localhost:5001/api/topologies";


const getToken = () => {
  return localStorage.getItem(
    "netviz_token"
  );
};


const getHeaders = () => {
  const token =
    getToken();

  return {
    "Content-Type":
      "application/json",

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),
  };
};


// =====================================================
// GET ALL
// =====================================================

export const getTopologies =
  async () => {
    const response =
      await fetch(
        API_BASE_URL,
        {
          headers:
            getHeaders(),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch topologies"
      );
    }

    return data;
  };


// =====================================================
// GET ONE
// =====================================================

export const getTopologyById =
  async (id) => {
    const response =
      await fetch(
        `${API_BASE_URL}/${id}`,
        {
          headers:
            getHeaders(),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch topology"
      );
    }

    return data;
  };


// =====================================================
// CREATE
// =====================================================

export const createTopology =
  async ({
    name,
    description,
    nodes,
    edges,
  }) => {
    const response =
      await fetch(
        API_BASE_URL,
        {
          method: "POST",

          headers:
            getHeaders(),

          body: JSON.stringify({
            name,
            description,
            nodes,
            edges,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to save topology"
      );
    }

    return data;
  };


// =====================================================
// UPDATE
// =====================================================

export const updateTopology =
  async ({
    id,
    name,
    description,
    nodes,
    edges,
  }) => {
    const response =
      await fetch(
        `${API_BASE_URL}/${id}`,
        {
          method: "PUT",

          headers:
            getHeaders(),

          body: JSON.stringify({
            name,
            description,
            nodes,
            edges,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to update topology"
      );
    }

    return data;
  };


// =====================================================
// DELETE
// =====================================================

export const deleteTopology =
  async (id) => {
    const response =
      await fetch(
        `${API_BASE_URL}/${id}`,
        {
          method: "DELETE",

          headers:
            getHeaders(),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to delete topology"
      );
    }

    return data;
  };