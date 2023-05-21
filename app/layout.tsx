import SupportProvider from "~/providers/support-provider";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WriteMinds",
  description: "Your AI-powered writing assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SupportProvider>
        <body className={inter.className}>{children}</body>
      </SupportProvider>
    </html>
  );
}
