const API_URL = "http://localhost:8000/auth";

export interface LoginResponse {
  status: string;
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
}

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/auth-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  return res.json();
}

export async function createUser(username: string, password: string) {
  const res = await fetch(`${API_URL}/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create user");
  }

  return res.json();
}

export async function getUserInfo(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/user-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}