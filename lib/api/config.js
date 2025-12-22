export const apiClient = async (endpoint, options = {}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  // Get token from localStorage (only in browser)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const text = await response.text();

    // Debug: log actual response if JSON parsing fails
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("API returned non-JSON response:", text);
      throw new Error("API returned invalid JSON. Check your endpoint.");
    }

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
