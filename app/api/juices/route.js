import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const juices = await prisma.juice.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
    return new Response(JSON.stringify(juices), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}