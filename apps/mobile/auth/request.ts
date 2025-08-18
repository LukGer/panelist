import { authClient } from "./client";

export const makeAuthenticatedRequest = async (
  url: string,
  options?: RequestInit
) => {
  const cookies = authClient.getCookie();
  const headers = {
    Cookie: cookies,
  };
  const response = await fetch(url, {
    headers,
    ...options,
  });

  return response;
};
