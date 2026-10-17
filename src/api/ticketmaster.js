const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = import.meta.env.VITE_TM_API_KEY;

export async function tmFetch(path, params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null)
  );

  const query = new URLSearchParams({ apikey: API_KEY, ...cleanParams });
  const response = await fetch(`${BASE_URL}${path}?${query}`);

  if (!response.ok) {
    if (response.status === 429) throw new Error('Too many requests. Please wait a moment and try again.');
    if (response.status === 401) throw new Error('Invalid API key. Check your .env file.');
    if (response.status === 404) throw new Error('Not found.');
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}