"use client"
import { AnimatePresence, motion } from "framer-motion";;
import { backendWrapper } from "@/components/backend/BackendWrapper";
import { NumberField, TextField } from "@/components/ui/InputFields";
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
import { burnSPL20 } from "@/components/backend/SPL20";
import { getAsset, getDigitalAssetBalance } from "@/components/backend/General";
import { enqueueSnackbar } from "notistack";

export default function Page() {
  const { wallet } = useWallet();
  const [theme, setTheme] = useState(0);
  const [rpc, setRpc] = useState(
    process.env.NEXT_PUBLIC_RPC_MAINNET|| "https://api.mainnet-beta.solana.com"
  );
  const connection = new Connection(rpc);
  //

  const [adress, setAdress] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const [maxSupply, setMaxSupply] = useState<number>(0);
  const [decimals, setDecimals] = useState<number>(0);
  const [progressing, setProgressing] = useState(false);
  const [result, setResult] = useState<BackendResponse>();

  const validate = async () => {
    try {
    } catch (e) {
      console.log("Error in panel: " + e);
    }
  };

  const run = async () => {
    if (wallet) {
      if (wallet.adapter) {
        if (wallet.adapter.connected) {
          if (wallet.adapter.publicKey) {
            if (adress) {
              const runner_1 = getAsset({
                wallet: wallet,
                connection: connection,
                assetId: adress,
              });

              const runner_2 = getDigitalAssetBalance({
                wallet,
                connection,
                assetId: adress,
              });

              const exe_1 = await backendWrapper({
                wallet,
                connection,
                initialMessage: "fetching asset",
                backendCall: async () => await runner_1,
              });
              const exe_2 = await backendWrapper({
                wallet,
                connection,
                initialMessage: "fetching accounts",
                backendCall: async () => await runner_2,
              });

              if (exe_1.status == 200 && exe_2.status == 200) {
                if (exe_1.tokenBalance && exe_2.tokenBalance) {
                  if (
                    exe_1.tokenBalance.decimals &&
                    exe_2.tokenBalance.balance
                  ) {
                    if (exe_2.tokenBalance.balance > 1) {
                      const runner_3 = burnSPL20({
                        wallet,
                        connection,
                        assetId: adress,
                        amount: amount * 10 ** exe_1.tokenBalance.decimals,
                      });
                      const response = await backendWrapper({
                        wallet,
                        connection,
                        initialMessage: "Burn tokens",
                        backendCall: async () => await runner_3,
                      });
                      setProgressing(false);
                      setResult(response);
                    } else {
                      enqueueSnackbar("Unknown error: TEA0001");
                    }
                  } else {
                    enqueueSnackbar("Unknown error: TEA0002");
                  }
                } else {
                  enqueueSnackbar("Unknown error: TEA0003");
                }
              } else {
                enqueueSnackbar("Unknown error: TEA0004");
              }
            } else {
              setProgressing(false);
              enqueueSnackbar("Invalid input.", {
                variant: "error",
              });
            }
          } else {
            setProgressing(false);
            enqueueSnackbar("Wallet has no public key.", {
              variant: "error",
            });
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
                <TextField label="Mint address" setValue={setAdress} />
                <NumberField
                  label="Amount to be burnt"
                  min={0}
                  max={1000000000000}
                  setValue={setAmount}
                />
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
        sectionID={3}
        operationID={1}
        theme={theme}
        setTheme={setTheme}
        rpc={rpc}
        setRpc={setRpc}
      />
    </>
  );
}
