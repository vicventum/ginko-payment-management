/**
 * Native fetch wrapper with optional baseURL.
 *
 * @param {string} url - Relative or absolute URL
 * @param {object} [options]
 * @param {string} [options.baseURL] - Base URL to prepend
 * @param {RequestInit} [options.fetchOptions] - Standard fetch options (method, headers, body, signal, etc.)
 * @returns {Promise<any>} Parsed JSON response
 */
export async function clientFetch(url, { baseURL = '', ...fetchOptions } = {}) {
  const resolved = baseURL
    ? `${baseURL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
    : url

  const response = await fetch(resolved, fetchOptions)

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`HTTP ${response.status}: ${response.statusText}${body ? ` — ${body}` : ''}`)
  }

  return response.json()
}
