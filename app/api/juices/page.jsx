async function getJuices() {
  const res = await fetch("http://localhost:3000/api/juices", { cache: "no-store" });
  return res.json();
}

export default async function JuicesPage() {
  const juices = await getJuices();
  return (
    <main className="container">
      <h2>Juices</h2>
      <ul>
        {juices.map(j => <li key={j.id}>{j.name}</li>)}
      </ul>
    </main>
  );
}