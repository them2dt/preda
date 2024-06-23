import "../style/globals.css";
import "../style/skeleton.css";

import "../style/adapter.css";
import "../style/navigation.css";
import "../style/mobile-nav.css";

import "../style/loader.css";
import "../style/form-components.css";
import "../style/backdrop.css";

import "../style/homepage.css";

//
//
import ClientWrapper from "./ClientWrapper";
import Head from "next/head";

export const metadata = {
  title: "Preda",
  description: "The powerhouse for solana tokens.",
  openGraph: {
    title: "Preda",
    description: "The powerhouse for solana tokens.",
    url: "https://emptea.xyz",
    siteName: "Preda",
    images: [
      {
        url: "https://xznxkqpr4hrwmizfsd5fahu3bcojuelofogb7kb5w6fm3jfdmxcq.arweave.net/vlt1QfHh42YjJZD6UB6bCJyaEW4rjB-oPbeKzaSjZcU",
        width: "500",
        height: "300",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Preda.",
    description: "The powerhouse for solana tokens.",
    creator: "@THEM2DT",
    images: [
      "https://xznxkqpr4hrwmizfsd5fahu3bcojuelofogb7kb5w6fm3jfdmxcq.arweave.net/vlt1QfHh42YjJZD6UB6bCJyaEW4rjB-oPbeKzaSjZcU",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClientWrapper>{children}</ClientWrapper>
    </html>
  );
}
