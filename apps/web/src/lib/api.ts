const API_BASE_URL =
  process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001/api';

type FetchJsonOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

export async function fetchJson<T>(
  path: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    cache: options.cache ?? 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API request failed (${response.status}): ${errorText || response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export async function getHealthStatus(): Promise<{ status: string }> {
  return fetchJson<{ status: string }>('/health');
}

export { API_BASE_URL };
