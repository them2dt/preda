"use client"
import { AnimatePresence, motion } from "framer-motion";;
import { backendWrapper } from "@/components/backend/BackendWrapper";
import { uploadFileToIrys } from "@/components/backend/General";
import AttributeBackdrop from "@/components/ui/AttributeBackdrop";
import CreatorBackdrop from "@/components/ui/CreatorBackdrop";
import { ImageInput, TextArea, TextField } from "@/components/ui/InputFields";
import ResultPanel from "@/components/ui/Result";
import SidePanel from "@/components/ui/SidePanel";
import { themes } from "@/components/utils/simples";
import { BackendResponse } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { createCNFT, createMerkleTree } from "@/components/backend/CNFT";

import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider } from "@emotion/react";
import { colors, createTheme } from "@mui/material";
import { publicKey } from "@metaplex-foundation/umi";

export default function Page() {
  const { wallet } = useWallet();
  const [theme, setTheme] = useState(0);

  const [rpc, setRpc] = useState(
    process.env.RPC_MAINNET|| "https://api.mainnet-beta.solana.com"
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
  //
  const [attributeModal, setAttributeModal] = useState(false);
  const [renderHook, setRenderHook] = useState<number>(0);
  const [attributeKey, setAttributeKey] = useState<string>();
  const [attributeValue, setAttributeValue] = useState<string>();
  const [attributes, setAttributes] = useState<
    { trait_type: string; value: string }[]
  >([]);
  //
  const [creatorModal, setCreatorModal] = useState(false);
  const [creatorKey, setCreatorKey] = useState<string>("");
  const [creatorValue, setCreatorValue] = useState<number>(0);
  const [creators, setCreators] = useState<
    { address: string; share: number }[]
  >([]);

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
                      if (attributes) {
                        if (creators) {
                          if (creators.length > 0) {
                            var totalShare = 0;
                            var duplicates = false;
                            for (let i = 0; i < creators.length; i++) {
                              //add to total-share
                              totalShare += creators[i].share;
                              //check for creator duplicates.
                              for (let j = 0; j < creators.length; j++) {
                                if (
                                  i != j &&
                                  creators[i].address == creators[j].address
                                ) {
                                  enqueueSnackbar("Duplicate found.", {
                                    variant: "error",
                                  });
                                  return false;
                                }
                              }
                            }
                            //check if share split sums up to 100.
                            if (totalShare == 100) {
                              setProgressing(true);
                              const runner = createMerkleTree({
                                connection: connection,
                                wallet: wallet,
                                size: 1,
                                visibility: true,
                              });

                              const merkletreeResponse = await backendWrapper({
                                wallet: wallet,
                                connection: connection,
                                initialMessage: "Creating merkle tree",
                                backendCall: async () => await runner,
                              });
                              if (merkletreeResponse.status == 200) {
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
                                      attributes: attributes || [],
                                      properties: {
                                        files: [
                                          {
                                            uri: imageUri.assetID,
                                            type: "image/png",
                                          },
                                        ],
                                        category: "image",
                                        creators:
                                          creators.length > 0
                                            ? creators
                                            : [
                                                {
                                                  address:
                                                    wallet.adapter.publicKey.toBase58(),
                                                  share: 100,
                                                },
                                              ],
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
                                        const runner = createCNFT({
                                          wallet: wallet,
                                          connection: connection,
                                          merkleTree: publicKey(
                                            merkletreeResponse.assetID || ""
                                          ),
                                          title: title,
                                          metadata: metadataUri.assetID,
                                          sellerFeeBasisPoints: sliderValue,
                                          creators:
                                            creators.length > 0
                                              ? creators
                                              : [
                                                  {
                                                    address:
                                                      wallet.adapter.publicKey.toBase58(),
                                                    share: 100,
                                                  },
                                                ],
                                        });
                                        const response = await backendWrapper({
                                          wallet: wallet,
                                          connection: connection,
                                          initialMessage: "creating asset",
                                          backendCall: async () => await runner,
                                        });
                                        setResult(response);
                                      } else {
                                        enqueueSnackbar(
                                          "Metadata upload failed.",
                                          {
                                            variant: "error",
                                          }
                                        );
                                      }
                                    } else {
                                      setProgressing(false);
                                      enqueueSnackbar(
                                        "Metadata upload failed.",
                                        {
                                          variant: "error",
                                        }
                                      );
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
                                enqueueSnackbar(
                                  "Couldn't create merkle tree.",
                                  {
                                    variant: "error",
                                  }
                                );
                              }
                            } else {
                              setProgressing(false);
                              enqueueSnackbar(
                                "Royalty shares adds up to " +
                                  totalShare +
                                  ", it has to add up to 100.",
                                { variant: "error" }
                              );
                            }
                          } else {
                            setProgressing(false);
                            enqueueSnackbar("No creators registered.", {
                              variant: "error",
                            });
                          }
                        } else {
                          setProgressing(false);
                          enqueueSnackbar("Invalid creators", {
                            variant: "error",
                          });
                        }
                      } else {
                        setProgressing(false);
                        enqueueSnackbar("Invalid Attributes.", {
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
                <button
                  className="backdrop-button font-text"
                  onClick={() => {
                    setAttributeModal(true);
                  }}
                >
                  Add Attributes
                </button>
                <button
                  className="backdrop-button font-text"
                  onClick={() => {
                    setCreatorModal(true);
                  }}
                >
                  Add Royalties
                </button>
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
      {attributeModal && (
        <AttributeBackdrop
          renderHook={renderHook}
          attributes={attributes}
          attributeKey={attributeKey}
          attributeValue={attributeValue}
          setRenderHook={setRenderHook}
          setAttributes={setAttributes}
          setAttributeKey={setAttributeKey}
          setAttributeValue={setAttributeValue}
          setAttributeModal={setAttributeModal}
          theme={theme}
        />
      )}
      {creatorModal && (
        <CreatorBackdrop
          renderHook={renderHook}
          creators={creators}
          creatorKey={creatorKey}
          creatorValue={creatorValue}
          setRenderHook={setRenderHook}
          setCreators={setCreators}
          setCreatorKey={setCreatorKey}
          setCreatorValue={setCreatorValue}
          setCreatorModal={setCreatorModal}
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
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
