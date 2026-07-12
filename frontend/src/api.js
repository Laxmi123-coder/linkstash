const BASE_URL = "https://linkstash-backend.onrender.com/api";

export async function registerUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

export async function getLinks(params = {}) {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams(params).toString();

  const response = await fetch(`${BASE_URL}/links${query ? `?${query}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not load links");
  }

  return data;
}

export async function addLink(url, tags) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url, tags }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not save link");
  }

  return data;
}

export async function deleteLink(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/links/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not delete link");
  }
}