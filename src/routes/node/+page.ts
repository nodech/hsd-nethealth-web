import {
  IP_PAGE
} from '$lib/files';

export async function load({ fetch, depends, url }) {
  const hostname = url.searchParams.get('hostname');
  let hostInfo = null;
  let hostFailed = true;

  if (hostname) {
    try {
      hostFailed = false;
      depends(IP_PAGE.ID);
      const response = await fetch(IP_PAGE.FILE(hostname));
      hostInfo = await response.json();
    } catch (e) {
      hostFailed = true;
      console.error(e);
    }
  }

  return { hostname, hostInfo, hostFailed };
}
