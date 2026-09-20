/**
 * Maps a backend error to a short, user-facing message.
 * Never expose internal error details to the client.
 */
export function friendlyGenerationError(error) {
  const status = error?.status ?? error?.response?.status;
  if (status === 404) {
    return 'Repository not found. Check the URL and make sure the repository is public.';
  }
  if (status === 401 || status === 403) {
    return 'GitHub denied access to this repository. Make sure it is public and the URL is correct.';
  }
  if (status === 429) {
    return 'The AI service is rate-limited right now. Please wait a minute and try again.';
  }
  return 'Something went wrong on the server. Please try again.';
}
