const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function apiRequest(
  endpoint,
  {
    mockData,
    delay = 300,
    query = {},
    options = {},
  } = {}
) {
  // Mock mode
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), delay);
    });
  }

  // Build query string
  const params = new URLSearchParams(query).toString();

  const url = params
    ? `${BASE_URL}${endpoint}?${params}`
    : `${BASE_URL}${endpoint}`;

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return data.result;
}