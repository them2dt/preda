import "../style/homepage.css";
import "../style/globals.css";
import "../style/skeleton.css";
import "../style/navigation.css";
import "../style/adapter.css";
import "../style/profile.css";
import "../style/gallery.css";
import "../style/singleItemView.css";
//
import "../style/panels/general.css";
import "../style/panels/1_nft.css";
import "../style/panels/2_pnft.css";
import "../style/panels/3_merkleTree.css";
import "../style/panels/4_cnft.css";
import "../style/panels/4_cnft.css";
import "../style/panels/5_spl.css";
import RootComponent from "./RootComponent";
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
        url: "https://bafybeig65argso4eqbepq63kjyu35e6inwfgfahaord2tt2trmi62nnive.ipfs.nftstorage.link/",
        width: "2000",
        height: "1200",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Preda.",
    description: "The powerhouse for solana tokens.",
    creator: "@THEM2DT",
    images: [
      "https://bafybeig65argso4eqbepq63kjyu35e6inwfgfahaord2tt2trmi62nnive.ipfs.nftstorage.link/",
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
      <RootComponent>{children}</RootComponent>
    </html>
  );
}
