import {
  MAIN_PAGE
} from '$lib/files';

export async function load({ fetch, depends }) {
  let main = null;

  try {
    depends(MAIN_PAGE.ID);
    const response = await fetch(MAIN_PAGE.FILE);
    main = await response.json();
  } catch (e) {
    console.error(e);
  }

  return { main };
}
