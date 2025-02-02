import { getStrapiUrl } from './strapi';
import type { ResourcesResource } from '@/types/strapi';

/**
 * Converts a MIME type to a friendly file type name
 * @param mime - The MIME type string
 * @returns A user-friendly file type name
 */
export const getFileType = (mime: string): string => {
  const type = mime.split('/')[1].toUpperCase();
  switch (type) {
    case 'PDF':
      return 'PDF Document';
    case 'JPEG':
    case 'JPG':
    case 'PNG':
      return 'Image';
    case 'DOC':
    case 'DOCX':
      return 'Word Document';
    case 'XLS':
    case 'XLSX':
      return 'Excel Spreadsheet';
    default:
      return type;
  }
};

/**
 * Gets the download URL and filename for a resource
 */
export const getResourceDownloadInfo = (resource: ResourcesResource) => {
  const url = getStrapiUrl(resource.file?.url);
  const filename = `${resource.name}.pdf`;

  return {
    url,
    filename,
    size: resource.file?.size || 0,
  };
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes - The file size in bytes
 * @returns A formatted string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
