const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

export function getAuthToken() {
  return typeof window !== "undefined"
    ? document.cookie.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1]
    : null;
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  return query.toString();
}

async function parseResponse(res, fallback) {
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? fallback);
  return data;
}

export async function getBlogs({ category = "", tag = "", search = "", page = 1, mine = false } = {}) {
  const query = buildQuery({ category, tag, search, page });
  const path = mine ? "/api/blogs/mine" : "/api/blogs";
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}${path}?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return parseResponse(res, "Failed to fetch blogs");
}

export async function getBlog(blogIdOrSlug) {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}/api/blogs/${blogIdOrSlug}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return parseResponse(res, "Failed to fetch blog");
}

export async function getStats() {
  const url = `${BASE_URL}/api/blogs/stats`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
    },
  });

  // console.log(res,'result')
  const data = await res.json();
  // console.log(data,'dataa')

  if (!res.ok) {
    throw new Error(data?.message ?? "Failed to fetch stats");
  }

  return data;
}

export async function deleteBlog(blogId) {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}/api/blogs/${blogId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Failed to delete blog");
  return data;
}

export async function createBlog(formData) {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}/api/blogs`, {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "Failed to create blog");
  }

  return data;
}

export async function updateBlog(blogId, formData) {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}/api/blogs/${blogId}`, {
    method: "PUT",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Failed to update blog");
  return data;
}

export async function toggleLike(blogId) {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}/api/blogs/${blogId}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return parseResponse(res, "Failed to update like");
}

export async function getComments(blogId) {
  const res = await fetch(`${BASE_URL}/api/blogs/${blogId}/comments`);
  return parseResponse(res, "Failed to fetch comments");
}

export async function addComment(blogId, content) {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}/api/blogs/${blogId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ content }),
  });
  return parseResponse(res, "Failed to add comment");
}
