export interface PageComponentPageSeoComponent {
  metaTitle: string;
  metaDescription: string;
  metaImage?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  keywords?: string;
  canonicalURL?: string;
}

export interface MediaImage {
  data: {
    attributes: {
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
      formats?: {
        thumbnail?: {
          url: string;
          width: number;
          height: number;
        };
        small?: {
          url: string;
          width: number;
          height: number;
        };
        medium?: {
          url: string;
          width: number;
          height: number;
        };
        large?: {
          url: string;
          width: number;
          height: number;
        };
      };
    };
  };
}

export interface Event {
  id: number;
  documentId: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  slug: string;
  meta: PageComponentPageSeoComponent;
  marqueeImage: MediaImage;
  squareImage: MediaImage;
  panelImage: MediaImage;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  localizations?: Event[];
}

export interface PopulateField {
  fields?: string[];
  populate?: string[] | Record<string, PopulateField>;
}

export interface QueryParams {
  populate?: string | string[] | Record<string, PopulateField>;
  filters?: Record<string, any>;
  sort?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
