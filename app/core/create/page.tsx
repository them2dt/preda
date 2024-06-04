"use client"
import { AnimatePresence, motion } from "framer-motion";;
import { backendWrapper } from "@/components/backend/BackendWrapper";
import { uploadFileToIrys } from "@/components/backend/General";
import { ImageInput, TextArea, TextField } from "@/components/ui/InputFields";
import ResultPanel from "@/components/ui/Result";

import SidePanel from "@/components/ui/SidePanel";
import { RPC_MAINNET, RPC_DEVNET } from "@/components/utils/simples";import { themes } from "@/components/utils/simples";
import { BackendResponse } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { createCoreAsset } from "@/components/backend/CORE";

import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider } from "@emotion/react";
import { colors, createTheme } from "@mui/material";

export default function Page() {
  const { wallet } = useWallet();
  const [theme, setTheme] = useState(0);

  const [rpc, setRpc] = useState(
    RPC_MAINNET
  );
  const connection = new Connection(rpc);
  //

  const [title, setTitle] = useState<string>();
  const [symbol, setSymbol] = useState<string>("");
  const [domain, setDomain] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [collection, setCollection] = useState<string>();
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState();
  const [sliderValue, setSliderValue] = useState<number>(0);

  const [progressing, setProgressing] = useState(false);
  const [result, setResult] = useState<BackendResponse>();

  const run = async () => {
    if (wallet) {
      if (wallet.adapter) {
        if (wallet.adapter.connected) {
          if (wallet.adapter.publicKey) {
            if (image) {
              if (title) {
                if (description) {
                  if (symbol) {
                    if (domain) {
                      setProgressing(true);
                      const imageUri = await uploadFileToIrys({
                        wallet: wallet,
                        connection: connection,
                        file: image,
                      });

                      if (imageUri.status == 200) {
                        if (imageUri.assetID) {
                          const metadata = {
                            name: title,
                            symbol: symbol,
                            description: description,
                            seller_fee_basis_points: sliderValue,
                            image: imageUri,
                            external_url: "emptea.xyz",
                            attributes: [],
                            properties: {
                              files: [
                                {
                                  uri: imageUri.assetID,
                                  type: "image/png",
                                },
                              ],
                              category: "image",
                            },
                            collection: {},
                          };

                          const metadataFile = new File(
                            [JSON.stringify(metadata)],
                            "metadata.json",
                            { type: "application/json" }
                          );
                          const metadataUri = await uploadFileToIrys({
                            wallet: wallet,
                            connection: connection,
                            file: metadataFile,
                          });
                          if (metadataUri.status == 200) {
                            if (metadataUri.assetID) {
                              const runner = createCoreAsset({
                                wallet: wallet,
                                connection: connection,
                                name: title,
                                metadata: metadataUri.assetID,
                              });
                              const response = await backendWrapper({
                                wallet: wallet,
                                connection: connection,
                                initialMessage: "Burning asset",
                                backendCall: async () => await runner,
                              });
                              setResult(response);
                            } else {
                              enqueueSnackbar("Metadata upload failed.", {
                                variant: "error",
                              });
                            }
                          } else {
                            setProgressing(false);
                            enqueueSnackbar("Metadata upload failed.", {
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
                        enqueueSnackbar("Image upload failed.", {
                          variant: "error",
                        });
                      }
                    } else {
                      setProgressing(false);
                      enqueueSnackbar("Invalid domain.", { variant: "error" });
                    }
                  } else {
                    setProgressing(false);
                    enqueueSnackbar("Invalid symbol.", { variant: "error" });
                  }
                } else {
                  setProgressing(false);
                  enqueueSnackbar("Invalid description.", { variant: "error" });
                }
              } else {
                setProgressing(false);
                enqueueSnackbar("Invalid name.", { variant: "error" });
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
                <TextField label="Name" setValue={setTitle} />
                <TextArea label="Description" setValue={setDescription} />
              </div>
              <div className="flex-column-center-start">
                <TextField label="Symbol" setValue={setSymbol} />
                <TextField label="Domain" setValue={setDomain} />
              </div>
            </div>
            <motion.div className="submit-container flex-column-center-center"><button className="submit font-h4" onClick={run}>
              Create
            </button></motion.div>
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
        sectionID={1}
        operationID={0}
        theme={theme}
        setTheme={setTheme}
        rpc={rpc}
        setRpc={setRpc}
      />
    </>
  );
}
