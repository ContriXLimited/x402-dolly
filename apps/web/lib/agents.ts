import { fetchProjects } from './api-client';
import type { ProjectApiResponse } from '@/types/project';

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
}

/**
 * Truncates text to a specified maximum length, adding ellipsis if needed
 */
export function truncateDescription(text: string, maxLength: number): string {
  // Handle null/undefined
  if (!text) {
    return '';
  }

  // Convert to string if needed
  const str = String(text);

  if (str.length <= maxLength) {
    return str;
  }

  // Find the last space before maxLength to avoid cutting words
  const truncated = str.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Maps a project from the API to an Agent interface
 * Filters projects with status !== 'NORMAL'
 */
export function mapProjectToAgent(project: ProjectApiResponse): Agent {
  try {
    const agent = {
      id: project.id || '',
      name: project.name || 'Unknown Project',
      description: truncateDescription(project.introduction, 150),
      avatar: '', // API doesn't provide avatars; use default gradient
    };
    return agent;
  } catch (error) {
    console.error('Error mapping project to agent:', project, error);
    // Return a fallback agent
    return {
      id: project.id || 'unknown',
      name: project.name || 'Unknown Project',
      description: 'Error loading project description',
      avatar: '',
    };
  }
}

/**
 * Fetches all agents (projects) from the API
 * Filters to only include projects with status='NORMAL'
 */
export async function fetchAgents(): Promise<Agent[]> {
  try {
    const projects = await fetchProjects();
    console.log('Agents: Total projects fetched:', projects.length);
    console.log('Agents: Projects:', projects);

    const normalProjects = projects.filter((project) => project.status === 'NORMAL');
    console.log('Agents: Projects with NORMAL status:', normalProjects.length);

    console.log('Agents: Starting to map projects...');
    const agents = normalProjects.map(mapProjectToAgent);
    console.log('Agents: Mapped agents:', agents);
    console.log('Agents: Successfully mapped', agents.length, 'agents');

    return agents;
  } catch (error) {
    console.error('Agents: Error in fetchAgents:', error);
    throw error;
  }
}

/**
 * Fetches a single agent by ID
 */
export async function fetchAgentById(id: string): Promise<Agent | null> {
  const agents = await fetchAgents();
  return agents.find((agent) => agent.id === id) || null;
}
