import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "NexusFlow — Modern Multi-Tenant Infrastructure",
  description:
    "The orchestration platform for modern organizations. Manage tasks, events, and teams with zero friction.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white antialiased min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
