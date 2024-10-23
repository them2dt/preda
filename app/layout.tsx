import "@/app-elements/app-stylesheets/globals.css";
import "@/app-elements/app-stylesheets/sidepanel.css";
import "@/app-elements/app-stylesheets/mobile-nav.css";
import "@/app-elements/app-stylesheets/loader.css";
import "@/app-elements/app-stylesheets/forms.css";
import "@/app-elements/app-stylesheets/home.css";
import "@/app-elements/app-stylesheets/adapter.css";
import "@/app-elements/app-stylesheets/backdrop.css";
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
