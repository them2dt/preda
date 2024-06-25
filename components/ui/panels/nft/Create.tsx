"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faX,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Tooltip } from "@mui/material";
import { createNFT } from "@/components/backend/NFT";
import { enqueueSnackbar } from "notistack";
import { ImageInput, Slider, TextArea, TextField } from "@/components/ui/TeaUI";
import { uploadFileToIrys, validateImage } from "@/components/backend/General";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AttributeBackdrop from "../../modals/AttributeBackdrop";
import CreatorBackdrop from "../../modals/CreatorBackdrop";

export default function Panel() {
  const [title, setTitle] = useState<string>();
  const [symbol, setSymbol] = useState<string>("");
  const [domain, setDomain] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [image, setImage] = useState();
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
  //
  const [resultAddress, setResultAddress] = useState<string>();
  const [result, setResult] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const removeAttribute = (index: number) => {
    const oldArray = attributes;
    if (oldArray) {
      oldArray.splice(index, 1);
      setAttributes(oldArray);
      console.log(oldArray);
    }
  };
  const removeCreator = (index: number) => {
    const oldArray = creators;
    if (oldArray) {
      oldArray.splice(index, 1);
      console.log(oldArray);
    }
  };
  const { wallet } = useWallet();
  const { connection } = useConnection();

  const validate = () => {
    var invalidPoints = 0;
    //---------------------------------------------------------------check if wallet is connected.
    if (wallet) {
      if (wallet.adapter?.connected) {
        //---------------------------------------------------------------check for basic metadata-input.
        if (title && description && symbol && description && image) {
          //---------------------------------------------------------------check for custom royalties.
          if (creators.length > 0) {
            enqueueSnackbar("Royalties are registered.", {
              variant: "success",
            });
            var totalShare = 0;
            for (let i = 0; i < creators.length; i++) {
              //add to total-share
              totalShare += creators[i].share;
              //---------------------------------------------------------------check for creator duplicates.
              for (let j = 0; j < creators.length; j++) {
                if (i != j && creators[i].address == creators[j].address) {
                  console.log(creators);
                  enqueueSnackbar("Duplicate found.", { variant: "error" });
                  invalidPoints++;
                }
              }
            }
            //---------------------------------------------------------------check if share split sums up to 100.
            if (totalShare == 100) {
            } else {
              invalidPoints++;
              enqueueSnackbar(
                "Royalty shares adds up to " +
                  totalShare +
                  ", it has to add up to 100.",
                { variant: "error" }
              );
            }
          } else {
            setCreators([
              {
                address: wallet.adapter.publicKey.toBase58(),
                share: 100,
              },
            ]);
            enqueueSnackbar("Default royalties are registered.", {
              variant: "info",
            });
          }
        } else {
          invalidPoints++;
          enqueueSnackbar("Emptea fields detected.", { variant: "error" });
        }
      } else {
        invalidPoints++;
        enqueueSnackbar("Wallet not connected", { variant: "error" });
      }
    } else {
      invalidPoints++;
      enqueueSnackbar("Wallet not connected", { variant: "error" });
    }

    return invalidPoints == 0;
  };
  const run = async () => {
    try {
      if (validate()) {
        enqueueSnackbar("Uploading image...", { variant: "info" });
        const imageUri = await uploadFileToIrys({
          wallet: wallet,
          connection: connection,
          file: image,
        });

        if (imageUri) {
          const metadata = {
            name: title,
            symbol: symbol,
            description: description,
            seller_fee_basis_points: sliderValue,
            image: imageUri,
            external_url: "emptea.xyz",
            attributes: attributes || [],
            properties: {
              files: [{ uri: imageUri, type: "image/png" }],
              category: "image",
              creators:
                creators.length > 0
                  ? creators
                  : [
                      {
                        address: wallet.adapter.publicKey.toBase58(),
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

          if (metadataUri) {
            const mint = await createNFT({
              wallet: wallet,
              connection: connection,
              title: title,
              metadata: metadataUri.assetID,
              sellerFeeBasisPoints: sliderValue,
              creators:
                creators.length > 0
                  ? creators
                  : [
                      {
                        address: wallet.adapter.publicKey.toBase58(),
                        share: 100,
                      },
                    ],
            });

            if (mint.assetID) {
              enqueueSnackbar("NFT created!", { variant: "success" });
              setResultAddress(mint.assetID);
              setSuccess(true);
              setResult(true);
            } else {
              enqueueSnackbar("NFT creation failed.", { variant: "error" });
              setSuccess(false);
              setResult(true);
            }
          } else {
            enqueueSnackbar("Metadata upload failed.", { variant: "error" });
            setSuccess(false);
            setResult(true);
          }
        } else {
          enqueueSnackbar("Image upload failed.", { variant: "error" });
          setSuccess(false);
          setResult(true);
        }
      }
    } catch (e) {
      enqueueSnackbar("Something went wrong.", { variant: "error" });
    }
  };

  return (
    <>
      <div className="panel-container flex-column-center-center">
        <div id="panel-nft" className="form flex-row-center-start">
          <div className="column flex-column-center-start">
            <TextField label="Name" setValue={setTitle} />
            <TextField label="Symbol" setValue={setSymbol} />
            <TextArea label="Description" setValue={setDescription} />
            <TextField label="Domain" setValue={setDomain} />
            <div
              className="backdrop-button flex-row-center-center font-text"
              onClick={() => {
                setAttributeModal(true);
              }}
            >
              add attributes
            </div>
            <div
              className="backdrop-button flex-row-center-center font-text"
              onClick={() => {
                setCreatorModal(true);
              }}
            >
              configure royalties
            </div>
          </div>
          <div className="column flex-column-center-start">
            <ImageInput
              image={image}
              setImage={setImage}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />
            <div className="spacer"></div>
            <button
              className="submit font-text-bold"
              disabled={!title || !symbol || !description || !image}
              onClick={run}
            >
              {!title || !symbol || !description || !image
                ? "fill out missing fields"
                : "create"}
            </button>
          </div>
        </div>
      </div>
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
        />
      )}
      {result && success && (
        <div id="result-backdrop" className="flex-row-center-center">
          <div id="result-panel" className="flex-column-center-center">
            <div className="headline flex-column-center-center">
              <FontAwesomeIcon icon={faCheckCircle} color="#0ba34b" />
              <div className="message font-h4">Success!</div>
            </div>
            <div className="buttons flex-column-center-center">
              <div className="button-base">
                <Link
                  href={"https://solana.fm/address/" + resultAddress}
                  target="_blank"
                >
                  <button className="button font-text-tiny-bold flex-row-center-center">
                    Open in Explorer
                  </button>
                </Link>
              </div>
              <div className="button-base">
                <Tooltip title={"Copy " + resultAddress}>
                  <button
                    className="button font-text-tiny-bold flex-row-center-center"
                    onClick={() => {
                      navigator.clipboard.writeText(resultAddress);
                    }}
                  >
                    Copy Address
                  </button>
                </Tooltip>
              </div>
              <div className="button-base close">
                <button
                  className="button close font-text-tiny-bold flex-row-center-center"
                  onClick={() => {
                    setResult(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {result && !success && (
        <div id="result-backdrop" className="flex-row-center-center">
          <div id="result-panel" className="flex-column-center-center">
            <div className="headline flex-column-center-center">
              <FontAwesomeIcon icon={faXmarkCircle} color="#d40f1c" />
              <div className="message font-h4">Something went wrong.</div>
            </div>
            <div className="buttons flex-column-center-center">
              <div className="button-base close">
                <button
                  className="button close font-text-tiny-bold flex-row-center-center"
                  onClick={() => {
                    setResult(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
