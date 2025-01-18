import { api } from "./client";
import type { QueryParams, Event } from "./types";

export const getEvents = async (params?: QueryParams) => {
  return api.get<Event[]>("events", {
    populate: "*",
    ...params,
  });
};

export const getEvent = async (slug: string, params?: QueryParams) => {
  return api.get<Event>(`events/${slug}`, {
    populate: "*",
    ...params,
  });
};
