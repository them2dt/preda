"use client";
import { motion } from "framer-motion";
import { uploadFileToIrys } from "@/components/backend/General";
import { ImageInput } from "@/components/ui/InputFields";
import ResultPanel from "@/components/ui/Result";
import SidePanel from "@/components/ui/SidePanel";
import { themes } from "@/components/utils/simples";
import { BackendResponse } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider } from "@emotion/react";
import { colors, createTheme } from "@mui/material";
import { backendWrapper } from "@/components/backend/BackendWrapper";
import GeneralResultPanel from "@/components/ui/ResultGeneral";

export default function Page() {
  const { wallet } = useWallet();
  const [theme, setTheme] = useState(0);

  const [rpc, setRpc] = useState<string>(
    process.env.NEXT_PUBLIC_RPC_DEVNET || "https://api.devnet.solana.com"
  );
  const connection = new Connection(rpc);
  //

  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState();
  const [progressing, setProgressing] = useState(false);
  const [result, setResult] = useState<BackendResponse>();

  const run = async () => {
    if (wallet) {
      if (wallet.adapter) {
        if (wallet.adapter.connected) {
          if (wallet.adapter.publicKey) {
            if (image) {
              setProgressing(true);
              const uploadRunner = uploadFileToIrys({
                wallet: wallet,
                connection: connection,
                file: image,
              });
              const imageUri = await backendWrapper({
                initialMessage: "Uploading image...",
                wallet: wallet,
                connection: connection,
                backendCall: () => uploadRunner,
              });
              if (imageUri.status == 200) {
                if (imageUri.assetID) {
                  setResult(imageUri);
                } else {
                  setProgressing(false);
                  enqueueSnackbar("Image upload failed.", {
                    variant: "error",
                  });
                }
              } else {
                setProgressing(false);
                enqueueSnackbar("Image upload failed.", {
                  variant: "error",
                });
              }
            } else {
              setProgressing(false);
              enqueueSnackbar("Invalid image.", { variant: "error" });
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
                <ImageInput
                  image={image}
                  setImage={setImage}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              </div>
            </div>
            <motion.div className="submit-container flex-column-center-center">
              <button className="submit font-h4" onClick={run}>
                Upload to Irys
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      {result && (
        <GeneralResultPanel
          result={result}
          setResult={setResult}
          theme={theme}
        />
      )}
      {progressing && !result && (
        <div
          className="backdrop flex-row-center-center"
          data-theme={themes[theme]}
        >
          <div id="processing-panel" className="flex-column-center-center">
            <div className="symbol">
              <ThemeProvider
                theme={createTheme({
                  palette: {
                    primary: {
                      500: "rgb(255, 255, 255)",
                    },
                  },
                })}
              >
                <CircularProgress color="primary" />
              </ThemeProvider>
            </div>
            <div className="font-h4">processing...</div>
          </div>
        </div>
      )}
      <SidePanel
        sectionID={4}
        operationID={0}
        theme={theme}
        setTheme={setTheme}
        rpc={rpc}
        setRpc={setRpc}
      />
    </>
  );
}
