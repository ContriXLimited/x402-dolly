/**
 * Project-related type definitions
 */

export interface ProjectApiResponse {
  id: string;
  name: string;
  introduction: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectsResponse = ProjectApiResponse[];
