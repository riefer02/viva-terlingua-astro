import type { PopulateField, QueryParams, ApiResponse } from "./types";

const BASE_URL = import.meta.env.STRAPI_URL;
const API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

if (!BASE_URL) {
  throw new Error("STRAPI_URL environment variable is not defined");
}

if (!API_TOKEN) {
  throw new Error("STRAPI_API_TOKEN environment variable is not defined");
}

function buildQueryString(params?: QueryParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.populate) {
    if (typeof params.populate === "string") {
      searchParams.append("populate", params.populate);
    } else if (Array.isArray(params.populate)) {
      searchParams.append("populate", params.populate.join(","));
    } else {
      searchParams.append("populate", JSON.stringify(params.populate));
    }
  }

  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      searchParams.append(`filters[${key}]`, JSON.stringify(value));
    });
  }

  if (params.sort) {
    params.sort.forEach((sort) => {
      searchParams.append("sort", sort);
    });
  }

  if (params.pagination) {
    if (params.pagination.page) {
      searchParams.append(
        "pagination[page]",
        params.pagination.page.toString()
      );
    }
    if (params.pagination.pageSize) {
      searchParams.append(
        "pagination[pageSize]",
        params.pagination.pageSize.toString()
      );
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: QueryParams
): Promise<ApiResponse<T>> {
  const queryString = buildQueryString(params);
  const url = `${BASE_URL}/api/${endpoint}${queryString}`;

  console.log("Fetching URL:", url);
  console.log("With headers:", {
    Authorization: `Bearer ${API_TOKEN.slice(0, 10)}...`,
    "Content-Type": "application/json",
    ...options.headers,
  });

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("API Error Response:", error);
    throw new Error(
      error.error?.message || "An error occurred while fetching the data"
    );
  }

  return response.json();
}

export const api = {
  async get<T>(endpoint: string, params?: QueryParams) {
    return fetchApi<T>(endpoint, { method: "GET" }, params);
  },

  async post<T>(endpoint: string, data: any, params?: QueryParams) {
    return fetchApi<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify({ data }),
      },
      params
    );
  },

  async put<T>(endpoint: string, data: any, params?: QueryParams) {
    return fetchApi<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify({ data }),
      },
      params
    );
  },

  async delete<T>(endpoint: string, params?: QueryParams) {
    return fetchApi<T>(endpoint, { method: "DELETE" }, params);
  },
};
