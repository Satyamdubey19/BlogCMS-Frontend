const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "Login failed");
  }

  return data;
}

export async function registerUser({ name, email, password, role }) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "Registration failed");
  }

  return data;
}
