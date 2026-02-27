const API_BASE = "/api/history";

export async function getHistory() {
  const res = await fetch(API_BASE);
  return res.json();
}

export async function addHistory(record) {
  await fetch(API_BASE, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(record)
  });
}
