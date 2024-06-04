"use client"
import { AnimatePresence, motion } from "framer-motion";;
import { backendWrapper } from "@/components/backend/BackendWrapper";
import { TextField } from "@/components/ui/InputFields";
import ResultPanel from "@/components/ui/Result";
import SidePanel from "@/components/ui/SidePanel";
import { themes } from "@/components/utils/simples";
import { BackendResponse } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import React, { useState } from "react";
import { burnNFT } from "@/components/backend/NFT";

import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

export default function Page() {
  const { wallet } = useWallet();
  const [theme, setTheme] = useState(0);
  const [rpc, setRpc] = useState(
    process.env.NEXT_PUBLIC_RPC_MAINNET|| "https://api.mainnet-beta.solana.com"
  );
  const connection = new Connection(rpc);
  //

  const [adress, setAdress] = useState<string>();
  const [progressing, setProgressing] = useState(false);
  const [result, setResult] = useState<BackendResponse>();

  const run = async () => {
    if (wallet) {
      if (wallet.adapter) {
        if (wallet.adapter.connected) {
          if (wallet.adapter.publicKey) {
            if (adress) {
              const runner = burnNFT({ wallet, connection, assetId: adress });
              const response = await backendWrapper({
                wallet: wallet,
                connection: connection,
                initialMessage: "Create NFT",
                backendCall: async () => await runner,
              });
              setProgressing(false);
              setResult(response);
            }
          }
        }
      }
    }
  };

  return (
    <>
      <div
        className="full-page-container flex-row-end-start"
        data-theme={themes[theme]}
      >
        <div className="content flex-column-start-center">
          <div className="form flex-column-center-center">
            <div className="row flex-row-center-start">
              <div className="flex-column-center-start">
                <TextField label="Mint address" setValue={setAdress} />
              </div>
            </div>
            <button className="submit font-h4" onClick={run}>
              Burn NFT
            </button>
          </div>
        </div>
      </div>
      {result && (
        <ResultPanel result={result} setResult={setResult} theme={theme} />
      )}
      {progressing && (
        <div
          className="backdrop flex-row-center-center"
          data-theme={themes[theme]}
        >
          <div id="processing-panel" className="flex-column-center-center">
            <div className="symbol">
              <CircularProgress color="primary" />
            </div>
            <div className="font-h4">processing...</div>
          </div>
        </div>
      )}
      <SidePanel
        sectionID={1}
        operationID={1}
        theme={theme}
        setTheme={setTheme}
        rpc={rpc}
        setRpc={setRpc}
      />
    </>
  );
}
