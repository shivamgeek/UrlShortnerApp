export async function shortenUrl(longUrl) {
  const response = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl }),
  });
  return response.json();
}

export async function getHistory() {
  const response = await fetch("/api/history");
  return response.json();
}
