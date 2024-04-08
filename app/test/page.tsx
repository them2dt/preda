"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import React, { useState } from "react";
import { fetchAsset } from "@/backend/CORE";
import { Connection } from "@solana/web3.js";
//Container to wrap all elements of a page into a container.

export default function Container({
  id,
  panel,
}: {
  id: number;
  panel: React.JSX.Element;
}) {
  const themes = ["light", "dark", "candy", "navy"];
  const [theme, setTheme] = useState(0);
  const { wallet } = useWallet();
  const { connection } = useConnection();

  const run = async () => {
    await fetchAsset({ wallet: wallet, connection: connection ,assetId:""});
  };
  return (
    <div>
      <div id="skeleton" className="skeleton" data-theme={themes[theme]}>
        <Header id={id} theme={theme} themes={themes} />
        <div id="mainboard" className="flex-row-center-start">
          <button onClick={run}>TEST</button>
        </div>
        <Navigation
          theme={theme}
          themes={themes}
          toggleTheme={(themeIdParameter: number) => setTheme(themeIdParameter)}
        />
      </div>
      <div className="skeleton-mobile flex-row-center-center">
        <div className="font-text">
          Have patience, while we work on the mobile version.
        </div>
      </div>
    </div>
  );
}
