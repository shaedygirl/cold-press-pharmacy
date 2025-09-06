export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-8 space-y-4">
      <h1 className="text-3xl font-bold">Cold Press Pharmacy</h1>
      <p className"text-muted-foreground">
        Clinically Crafted.  Nutrient Dense.  Beautifully Drinkable.
      </p>
      <a href="/juices" className"text-blue-600 underline">See Juices</a>
    </main>
    <main style={{padding:"2rem", fontFamily:"ui-sans-serif"}}>
      <h1>Cold Press Pharmacy</h1>
      <p>Nutrition you can feel. Data you can trust.</p>
    </main>
  );
}
