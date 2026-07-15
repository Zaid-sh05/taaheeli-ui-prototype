const arLocale = "ar";

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(arLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
