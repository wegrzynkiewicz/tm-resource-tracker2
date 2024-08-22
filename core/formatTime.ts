
export function formatTime(date: Date) {
  return date.toISOString().substring(11, 19);
}
