import { stringify } from "query-string";

export function generateUrl(
  participants: Array<{ name: string }>,
  seed?: number
) {
  const storedState = {
    s: seed,
    p: participants.map(({ name }) => name).join(",")
  };

  return `/?${stringify(storedState)}`;
}
