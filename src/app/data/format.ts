export function formatName(name: string) {
  const i = name.indexOf(" - ");
  if (i >= 0) return name.slice(0, i);
  return name;
}
