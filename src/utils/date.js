export function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

export function isToday(date) {
  return date === getTodayISO();
}
