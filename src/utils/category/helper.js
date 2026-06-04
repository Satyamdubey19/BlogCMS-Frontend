function getBaseUrl() {
  const configuredUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

  if (typeof window !== "undefined") {
    const currentOrigin = window.location.origin;
    if (!configuredUrl || configuredUrl === currentOrigin) {
      return "http://localhost:8000";
    }
  }

  return configuredUrl || "http://localhost:8000";
}

const DEFAULT_CATEGORIES = [
  { _id: "default-technology", title: "Technology" },
  { _id: "default-travel", title: "Travel" },
  { _id: "default-lifestyle", title: "Lifestyle" },
  { _id: "default-business", title: "Business" },
  { _id: "default-education", title: "Education" },
];

export async function fetchCategories() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/categories`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.message || `Failed to fetch categories (${res.status})`);
    }

    const data = await res.json();
    const categories = data?.categories?.map(item => ({
      _id: item._id,
      title: item?.title ? item.title.charAt(0).toUpperCase() + item.title.slice(1) : "",
    })).filter(item => item._id && item.title) || [];

    return categories.length ? categories : DEFAULT_CATEGORIES;

  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Using default categories because API categories failed:", error.message);
    }
    return DEFAULT_CATEGORIES;
  }
}
