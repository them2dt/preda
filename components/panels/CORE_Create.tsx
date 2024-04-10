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
import { createCoreAsset } from "@/backend/CORE";
import { enqueueSnackbar } from "notistack";
import { CustomSlider } from "@/components/Slider";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { backendWrapper } from "../BackendWrapper";
import ResultPanel from "../ResultPanel";
import { BackendResponse } from "@/types";

export default function Panel() {
  const [title, setTitle] = useState<string>();
  const [symbol, setSymbol] = useState<string>("");
  const [domain, setDomain] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [collection, setCollection] = useState<string>();
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

  const [result, setResult] = useState<BackendResponse>();

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
            external_url: domain || "emptea.xyz",
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
            const runner = createCoreAsset({
              wallet: wallet,
              connection: connection,
              name: title,
              metadata: metadataUri,
              collection: collection || null,
            });
            const response = await backendWrapper({
              wallet: wallet,
              connection: connection,
              initialMessage: "Create CORE collection",
              backendCall: async () => await runner,
            });
          } else {
            enqueueSnackbar("Metadata upload failed.", { variant: "error" });
          }
        } else {
          enqueueSnackbar("Image upload failed.", { variant: "error" });
        }
      }
    } catch (e) {
      enqueueSnackbar("Something went wrong.", { variant: "error" });
    }
  };

  return (
    <>
      <div className="panel-container flex-column-center-center">
        <div className="font-h3">Create a CORE Asset</div>
        <div id="panel-core-create" className="panel flex-row-center-start">
          <div className="form flex-column-center-start">
            <input
              type="text"
              name="title"
              placeholder="Name"
              className="font-text-small"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <input
              type="text"
              name="symbol"
              maxLength={5}
              placeholder="Symbol"
              className="font-text-small"
              value={symbol}
              onChange={(e) => {
                setSymbol(e.target.value.toUpperCase());
              }}
            />
            <textarea
              //type="text"
              name="description"
              placeholder="Description"
              className="font-text-small"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <input
              type="text"
              name="domain"
              placeholder="domain (optional)"
              className="font-text-small"
              onChange={(e) => {
                setDomain(e.target.value);
              }}
            />
            <input
              type="text"
              name="collection"
              placeholder="Collection adress (optional)"
              className="font-text-small"
              onChange={(e) => {
                setCollection(e.target.value);
              }}
              onFocus={() => {
                enqueueSnackbar(
                  "Make sure to enter a correct collection address.",
                  { variant: "warning" }
                );
              }}
            />
            <div
              className="attributes-button font-text"
              onClick={() => {
                setAttributeModal(true);
              }}
            >
              add attributes
            </div>
            <div
              className="attributes-button font-text"
              onClick={() => {
                setCreatorModal(true);
              }}
            >
              configure royalties
            </div>
          </div>
          <div className="form flex-column-center-start">
            <div
              className="image"
              onClick={() => {
                const imageInput = document.getElementById("image-input");
                if (imageInput) {
                  imageInput.click();
                }
              }}
            >
              {image ? (
                <img src={imagePreview} alt="image-preview" />
              ) : (
                <div className="placeholder font-text-small">
                  click here to import an image
                </div>
              )}
              <input
                type="file"
                name="cover"
                id="image-input"
                accept="image/png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    validateImage(e.target.files[0], setImage, setImagePreview);
                    console.log(e.target.files[0].name);
                  }
                }}
              />
            </div>
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
        <div
          className="attribute-modal"
          id="attribute-modal"
          onClick={() => {
            setAttributeModal(false);
          }}
        >
          <div
            className="attributes"
            onClick={(e) => {
              e.stopPropagation();
            }}
            key={renderHook}
          >
            {attributes?.map((attribute, index) => {
              return (
                <div
                  className="attribute"
                  key={"nft-attribute-" + index}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("clicked.");
                    removeAttribute(index);
                    setRenderHook(renderHook + 1);
                  }}
                >
                  <div className="key font-text-bold">
                    {attribute.trait_type}
                  </div>

                  <div className="line"></div>
                  <div className="value font-text-light">{attribute.value}</div>
                </div>
              );
            })}
          </div>
          {/*Modal component. Frames the modal content.*/}
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="create-attributes font-text">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input">
                  <input
                    type="text"
                    className="key font-text"
                    placeholder="key"
                    required
                    onChange={(e) => {
                      setAttributeKey(e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    className="value font-text"
                    placeholder="value"
                    required
                    onChange={(e) => {
                      setAttributeValue(e.target.value);
                    }}
                  />
                </div>
                <button
                  className="submit font-text"
                  type="submit"
                  disabled={!attributeKey || !attributeValue}
                  onClick={() => {
                    setAttributes([
                      ...(attributes || []),
                      {
                        trait_type: attributeKey || "",
                        value: attributeValue || "",
                      },
                    ]);
                  }}
                >
                  {!attributeKey || !attributeValue
                    ? "fill in the fields"
                    : "add"}
                </button>
              </form>
            </div>
          </div>
          {/* Button with x symbol */}
          <button
            onClick={() => setAttributeModal(false)}
            className="close-button"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
      )}

      {creatorModal && (
        <div
          className="attribute-modal"
          id="attribute-modal"
          onClick={() => {
            setAttributeModal(false);
          }}
        >
          <div
            className="attributes"
            onClick={(e) => {
              e.stopPropagation();
            }}
            key={"creator-" + renderHook}
          >
            {creators?.map((attribute, index) => {
              return (
                <div
                  className="attribute"
                  key={"nft-creator-" + index}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("clicked.");
                    removeCreator(index);
                    setRenderHook(renderHook + 1);
                  }}
                >
                  <div className="key font-text-bold">{attribute.address}</div>

                  <div className="line"></div>
                  <div className="value font-text-light">
                    {attribute.share.toString()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="royalties flex-column-center-center">
            <div className="legend flex-row-between-center">
              <div className="font-text-small">royalties</div>
              <div className="font-text-small-bold">
                {sliderValue.toString()}%
              </div>
            </div>
            <div className="slider-container">
              <CustomSlider
                min={0}
                max={20}
                step={1}
                value={sliderValue} // Fix: Change the type of sliderValue to number
                onChange={(
                  event: Event,
                  value: number | number[],
                  activeThumb: number
                ) => {
                  if (typeof value == "number") {
                    setSliderValue(value);
                  }
                }}
              />
            </div>
          </div>
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="create-attributes font-text">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input">
                  <input
                    type="text"
                    className="key font-text"
                    placeholder="Creator"
                    required
                    value={creatorKey}
                    onChange={(e) => {
                      setCreatorKey(e.target.value);
                    }}
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={creatorValue}
                    className="value font-text"
                    placeholder="Share (%)"
                    required
                    onChange={(e) => {
                      setCreatorValue(Number(e.target.value));
                    }}
                  />
                </div>
                <button
                  className="submit font-text"
                  type="submit"
                  disabled={
                    !creatorKey ||
                    !/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(creatorKey) ||
                    !creatorValue ||
                    creatorValue < 0
                  }
                  onClick={() => {
                    setCreators([
                      ...(creators || []),
                      {
                        address: creatorKey || "",
                        share: creatorValue || 0,
                      },
                    ]);
                    setCreatorKey("");
                    setCreatorValue(100 - creatorValue);
                  }}
                >
                  {!creatorKey ||
                  !/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(creatorKey) ||
                  !creatorValue ||
                  creatorValue < 0
                    ? "fill correctly in the fields"
                    : "add"}
                </button>
              </form>
            </div>
          </div>
          {/* Button with x symbol */}
          <button
            onClick={() => {
              setCreatorModal(false);
            }}
            className="close-button"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
      )}
      {result && <ResultPanel result={result} setResult={setResult} />}

    </>
  );
}
