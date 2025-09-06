import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

async function createJuice(formData){
	"use server";
	const name = formData.get("name")?.toString().trim();
	const type = formData.get("type")?.toString().trim();
	const desc = formData.get("description")?.toString().trim();

	if(!name || !type || !desc) return;

	await prisma.juice.create({ data: { name, type: type, description: desc } });
	revalidatePath("/juices");
}

export default function NewJuicePage(){
	return (
		<main className="max-w-xl mx-auto p-8 space-y-6">
			<h1 className="text-2xl font-semibold">Add a new Juice</h1>
			<form action={createJuice} className="space-y-3">
				<label className="grid gap-1">
					<span>Juice Name</span>
					<input name="name" placeholder="Neuro Boost" className="border p-2 rounded" required />
				</label>

				<label className="grid gap-1">
					<span>Type</span>
					<select name="type" className="border p-2 rounded">
						<option value="juice">Juice</option>
						<option value="smoothie">Smoothie</option>
						<option value="shot">Shot</option>
					</select>
				</label>

				<label className="grid gap-1">
					<span>Description</span>
					<input name="description" placeholder="Neuro Boost" className="border p-2 rounded" required />
				</label>

				<button className="bg-black text-white px-4 py-2 rounded">Save</button>
			</form>
		</main>
	);
}