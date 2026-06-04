const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

export async function fetchCategories() {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`, {
      method: "GET",
      // cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await res.json();

    return data?.categories?.map(item => ({ _id: item._id, title: item?.title ? item.title.charAt(0).toUpperCase() + item.title.slice(1) : "" })) || [];

  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }
}
