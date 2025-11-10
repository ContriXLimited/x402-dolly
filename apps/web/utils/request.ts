/**
 * HTTP request utility with error handling
 */

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  baseURL?: string;
}

interface RequestResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export class RequestError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

const DEFAULT_BASE_URL = '/api';

/**
 * Generic request utility for API calls
 * Uses /api prefix which is rewritten by Next.js to the backend URL
 */
export async function request<T>(
  config: RequestConfig,
): Promise<RequestResponse<T>> {
  const { method, url, data, headers = {}, baseURL = DEFAULT_BASE_URL } = config;

  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new RequestError(
        `Request failed: ${response.statusText}`,
        response.status,
      );
    }

    const responseData = await response.json();

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (error instanceof RequestError) {
      throw error;
    }

    // Network errors or other exceptions
    throw new RequestError(
      error instanceof Error ? error.message : 'Request failed',
    );
  }
}
