import "./globals.css";

export const metadata = {
  title: "Greg's Sedona Retreats — STR Intelligence",
  description: "AI-powered business intelligence for short-term rentals, powered by Hospitable MCP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
