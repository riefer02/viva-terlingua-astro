# API Client Documentation

This directory contains the API client for interacting with the Strapi backend.

## Structure

- `client.ts`: Base API client with generic request methods (get, post, put, delete)
- `types.ts`: Common TypeScript interfaces used across the API
- `events.ts`: Helper functions for interacting with the Events resource

## Usage

### Events API

```typescript
import { getEvents, getEvent } from "../lib/api/events";

// Fetch multiple events
const events = await getEvents({
  pagination: {
    page: 1,
    pageSize: 10,
  },
});

// Fetch single event by slug
const event = await getEvent("event-slug");
```

### Query Parameters

All API helpers accept query parameters for filtering, sorting, and pagination:

```typescript
interface QueryParams {
  populate?: string | string[] | Record<string, PopulateField>;
  filters?: Record<string, any>;
  sort?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}
```

## Environment Variables

The API client requires the following environment variables:

- `STRAPI_URL`: Base URL of your Strapi backend (e.g., http://localhost:1337)
- `STRAPI_API_TOKEN`: API token for authentication
