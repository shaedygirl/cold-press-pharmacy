// app/juices/page.jsx

async function getJuices() {
  // fetch your API route
  const res = await fetch("http://localhost:3000/api/juices", {
    cache: "no-store", // ensures fresh data, not cached
  });
  if (!res.ok) {
    throw new Error("Failed to fetch juices");
  }
  return res.json();
}

export default async function JuicesPage() {
  const juices = await getJuices();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Cold Press Juices</h1>
      {juices.length === 0 ? (
        <p>No juices yet — try adding some in Supabase!</p>
      ) : (
        <ul>
          {juices.map((j) => (
            <li key={j.id}>{j.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}