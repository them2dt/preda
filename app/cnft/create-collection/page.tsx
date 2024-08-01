"use client";
import { motion } from "framer-motion";
import { backendWrapper } from "@/components/backend/BackendWrapper";
import { NumberField } from "@/components/ui/InputFields";
import ResultPanel from "@/components/ui/Result";

import SidePanel from "@/components/ui/SidePanel";
import { RPC_MAINNET } from "@/components/utils/simples";
import { themes } from "@/components/utils/simples";
import { BackendResponse } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { createMerkleTree } from "@/components/backend/CNFT";

import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

export default function Page() {
  const { wallet } = useWallet();
  const [theme, setTheme] = useState(0);

  const [rpc, setRpc] = useState(RPC_MAINNET);
  const connection = new Connection(rpc);
  //

  const [size, setSize] = useState<number>(0);

  const [progressing, setProgressing] = useState(false);
  const [result, setResult] = useState<BackendResponse>();

  const run = async () => {
    if (wallet) {
      if (wallet.adapter) {
        if (wallet.adapter.connected) {
          if (wallet.adapter.publicKey) {
            setProgressing(true);
            const runner = createMerkleTree({
              connection: connection,
              wallet: wallet,
              size: size,
              visibility: true,
            });

            const response = await backendWrapper({
              wallet: wallet,
              connection: connection,
              initialMessage: "Creating merkle tree",
              backendCall: async () => await runner,
            });
            if (response.status == 200) {
              setResult(response);
            } else {
              setProgressing(false);
              enqueueSnackbar("Couldn't create merkle tree.", {
                variant: "error",
              });
            }
          } else {
            setProgressing(false);
            enqueueSnackbar("Wallet has no public key.", { variant: "error" });
          }
        } else {
          setProgressing(false);
          enqueueSnackbar("Wallet is not connected.", { variant: "error" });
        }
      } else {
        setProgressing(false);
        enqueueSnackbar("Couldn't find a compatible wallet.", {
          variant: "error",
        });
      }
    } else {
      setProgressing(false);
      enqueueSnackbar("Couldn't find a wallet-object.", { variant: "error" });
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
                <NumberField
                  label="Supply"
                  min={0}
                  max={1000000000000}
                  setValue={setSize}
                />
              </div>
            </div>
            <motion.div className="submit-container flex-column-center-center">
              <button className="submit font-h4" onClick={run}>
                Create
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      {result && (
        <ResultPanel result={result} setResult={setResult} theme={theme} />
      )}
      {progressing && !result && (
        <div
          className="backdrop flex-row-center-center"
          data-theme={themes[theme]}
        >
          <div id="processing-panel" className="flex-column-center-center">
            <div className="symbol">
              <ThemeProvider theme={createTheme()}>
                <CircularProgress color="primary" />
              </ThemeProvider>
            </div>
            <div className="font-h4">processing...</div>
          </div>
        </div>
      )}
      <SidePanel
        sectionID={2}
        operationID={0}
        theme={theme}
        setTheme={setTheme}
        rpc={rpc}
        setRpc={setRpc}
      />
    </>
  );
}
