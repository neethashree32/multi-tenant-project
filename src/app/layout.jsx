import "./globals.css";

export const metadata = {
  title: "NexusFlow — Modern Multi-Tenant Infrastructure",
  description:
    "The orchestration platform for modern organizations. Manage tasks, events, and teams with zero friction.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
