import "./globals.css";
import "@/styles/turmeric.css"; // adjust path to where turmeric.css lives

export const metadata = {
  title: "Cold Press Clinic",
  description: "Turmeric search for Cold Press Pharmacy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}

