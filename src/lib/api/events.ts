import { api } from "./client";
import type { QueryParams } from "./types";

export interface Event {
  id: number;
  attributes: {
    title: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    slug: string;
    marqueeImage: {
      data: {
        attributes: {
          url: string;
          formats: Record<string, any>;
        };
      };
    };
    squareImage: {
      data: {
        attributes: {
          url: string;
          formats: Record<string, any>;
        };
      };
    };
    panelImage: {
      data: {
        attributes: {
          url: string;
          formats: Record<string, any>;
        };
      };
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

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
