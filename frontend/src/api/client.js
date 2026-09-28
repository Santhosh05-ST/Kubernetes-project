/**
 * Thin wrapper around fetch() that:
 *  - throws a readable Error on non-2xx responses (using the backend's JSON error body when present)
 *  - returns parsed JSON, or null for 204 No Content
 */
export async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  if (res.status === 204) {
    return null
  }

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const body = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    const message = body?.message || `Request failed with status ${res.status}`
    const error = new Error(message)
    error.status = res.status
    error.body = body
    throw error
  }

  return body
}
