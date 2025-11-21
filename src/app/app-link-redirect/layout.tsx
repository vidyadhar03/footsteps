import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open in Footsteps App | Footsteps",
  description: "You've been invited to view content in the Footsteps app. Download Footsteps to explore travel stories, journeys, and connect with travelers.",
  openGraph: {
    title: "Open in Footsteps App",
    description: "You've been invited to view content in the Footsteps app. Download Footsteps to explore travel stories, journeys, and connect with travelers.",
    type: "website",
    siteName: "Footsteps",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open in Footsteps App",
    description: "You've been invited to view content in the Footsteps app. Download Footsteps to explore travel stories, journeys, and connect with travelers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AppLinkRedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

