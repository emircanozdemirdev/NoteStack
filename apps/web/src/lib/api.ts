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
      ...(options.body !== undefined && options.body !== null
        ? { 'Content-Type': 'application/json' }
        : {}),
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

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<AuthTokensResponse> {
  return fetchJson<AuthTokensResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerWithCredentials(
  email: string,
  password: string,
): Promise<AuthTokensResponse> {
  return fetchJson<AuthTokensResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export type AuthMeResponse = {
  id: string;
  email: string;
};

export async function getCurrentUser(accessToken: string): Promise<AuthMeResponse> {
  return fetchJson<AuthMeResponse>('/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string }> {
  return fetchJson<{ accessToken: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export type NoteItem = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export async function listNotes(accessToken: string): Promise<NoteItem[]> {
  return fetchJsonAuthenticated<NoteItem[]>('/notes', accessToken, {
    method: 'GET',
  });
}

export async function getNote(accessToken: string, noteId: string): Promise<NoteItem> {
  return fetchJsonAuthenticated<NoteItem>(`/notes/${noteId}`, accessToken, {
    method: 'GET',
  });
}

export async function createNote(
  accessToken: string,
  input: { title: string; content: string },
): Promise<NoteItem> {
  return fetchJsonAuthenticated<NoteItem>('/notes', accessToken, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateNote(
  accessToken: string,
  noteId: string,
  input: { title: string; content: string },
): Promise<NoteItem> {
  return fetchJsonAuthenticated<NoteItem>(`/notes/${noteId}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

/** Authenticated JSON request; injects Bearer token. */
export async function fetchJsonAuthenticated<T>(
  path: string,
  accessToken: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  return fetchJson<T>(path, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export { API_BASE_URL };
