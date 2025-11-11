/**
 * Project API service
 */

import { request, RequestError } from '@/utils/request';
import type { ProjectsResponse, ProjectApiResponse } from '@/types/project';

// Re-export RequestError for backward compatibility
export { RequestError as ApiError };

// Get all projects
export const getProjects = async (): Promise<ProjectsResponse> => {
  console.log('API: Requesting /projects...');
  const response = await request<ProjectsResponse>({
    method: 'GET',
    url: '/projects',
  });

  console.log('API: Raw response:', response);
  console.log('API: Response data:', response.data);
  console.log('API: Is array?', Array.isArray(response.data));

  if (!Array.isArray(response.data)) {
    console.error('API: Invalid response format, expected array but got:', typeof response.data);
    throw new RequestError('Invalid response format: expected an array');
  }

  console.log('API: Returning', response.data.length, 'projects');
  return response.data;
};

// Get a single project by ID
export const getProjectById = async (
  id: string,
): Promise<ProjectApiResponse | null> => {
  const projects = await getProjects();
  return projects.find((project) => project.id === id) || null;
};

// Legacy function names for backward compatibility
export const fetchProjects = getProjects;
export const fetchProjectById = getProjectById;
