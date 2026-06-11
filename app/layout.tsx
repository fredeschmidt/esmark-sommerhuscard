import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://esmark.de"),
  title: {
    default: "Sommerhuse ved Vestkysten | Esmark",
    template: "%s | Esmark",
  },
  description:
    "Find dit sommerhus ved den jyske vestkyst. Hundevenlige feriehuse med plads til hele familien.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Esmark",
    locale: "da_DK",
    url: "/",
    title: "Sommerhuse ved Vestkysten | Esmark",
    description:
      "Find dit sommerhus ved den jyske vestkyst. Hundevenlige feriehuse med plads til hele familien.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sommerhuse ved Vestkysten | Esmark",
    description:
      "Find dit sommerhus ved den jyske vestkyst. Hundevenlige feriehuse med plads til hele familien.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body>
        <a
          href="#indhold"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Spring til indhold
        </a>
        {children}
      </body>
    </html>
  );
}
