// app/juices/page.jsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function JuicesPage(){
  const juices = await prisma.juice.findMany({ orderBy: { name: "asc" }});

  return(
    <main className="max-w-2xl mx-auto p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Juices</h1>
        <Link className="underline" href="juices/new">+ Add Juice</Link>
      </div>

      <ul className="divide-y rounded borders">
        {juices.map(j => (
          <li key={j.id} className="p-3">{j.name}</li>
        ))}
        {juices.length === 0 && (
          <li className="p-3 text-muted-foreground">No juices yet.</li>
        )}
      </ul>
    </main>
  );
}