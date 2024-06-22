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
import { createCoreAsset, fetchAsset, updateCoreAsset } from "@/backend/CORE";
import { enqueueSnackbar } from "notistack";
import { CustomSlider } from "@/components/Slider";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { metadata } from "@/app/layout";
import { collectionAddress } from "@metaplex-foundation/mpl-core";

export default function Panel() {
  const [title, setTitle] = useState<string>();
  const [symbol, setSymbol] = useState<string>("");
  const [domain, setDomain] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [imageMetadata, setImageMetadata] = useState<string>();
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

  const [address, setAddress] = useState<string>();
  const [adressValid, setAdressValid] = useState<boolean>(false);

  const [collection, setCollection] = useState<string>();

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
      //---------------------------------------------------------------check for basic metadata-input.
      if (
        title &&
        description &&
        symbol &&
        description &&
        (image || imageMetadata)
      ) {
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

    return invalidPoints == 0;
  };
  const run = async () => {
    try {
      if (validate()) {
        if (imageMetadata && !image && !imagePreview) {
          const metadata = {
            name: title,
            symbol: symbol,
            description: description,
            seller_fee_basis_points: sliderValue,
            image: imageMetadata,
            external_url: "emptea.xyz",
            attributes: attributes || [],
            properties: {
              files: [{ uri: imageMetadata, type: "image/png" }],
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
            if (collection) {
              const mint = await updateCoreAsset({
                wallet: wallet,
                connection: connection,
                assetId: address,
                name: title,
                metadata: metadataUri,
                collection: collection,
              });

              if (mint) {
                enqueueSnackbar("Asset Updated!", { variant: "success" });
                setResultAddress(mint.assetID || "");
                setSuccess(true);
                setResult(true);
              } else {
                enqueueSnackbar("Asset update failed.", { variant: "error" });
                setSuccess(false);
                setResult(true);
              }
            } else {
              const mint = await updateCoreAsset({
                wallet: wallet,
                connection: connection,
                assetId: address,
                name: title,
                metadata: metadataUri,
              });

              if (mint) {
                enqueueSnackbar("Asset Updated!", { variant: "success" });
                setResultAddress(mint.assetID || "");
                setSuccess(true);
                setResult(true);
              } else {
                enqueueSnackbar("Asset update failed.", { variant: "error" });
                setSuccess(false);
                setResult(true);
              }
            }
          } else {
            enqueueSnackbar("Asset upload failed.", { variant: "error" });
            setSuccess(false);
            setResult(true);
          }
        } else {
          enqueueSnackbar("Uploading assets...", { variant: "info" });
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
              const mint = await updateCoreAsset({
                wallet: wallet,
                connection: connection,
                assetId: address,
                name: title,
                metadata: metadataUri,
              });

              if (mint) {
                enqueueSnackbar("NFT created!", { variant: "success" });
                setResultAddress(mint.assetID || "");
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
      }
    } catch (e) {
      enqueueSnackbar("Something went wrong.", { variant: "error" });
    }
  };
  const findAsset = async () => {
    console.log("Finding Asset");
    if (/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(address)) {
      const result = await fetchAsset({
        wallet: wallet,
        connection: connection,
        assetId: address,
      });
      if (result.coreAsset) {
        enqueueSnackbar("Asset found", { variant: "success" });

        //try to fetch metadata & more..
        if (result.coreAsset) {
          const collectionRes = collectionAddress(result.coreAsset);
          const metadata = await axios.get(result.coreAsset.uri);
          if (metadata) {
            console.log(metadata);
            console.log("Name: " + metadata.data["name"]);
            console.log("Description: " + metadata.data["description"]);
            console.log("Symbol: " + metadata.data["symbol"]);
            console.log("Attributes: " + metadata.data["attributes"]);
            console.log("URL: " + metadata.data["external_url"]);
            console.log(
              "Royalties: " + metadata.data["seller_fee_basis_points"]
            );

            setTitle(metadata.data["name"] || "");
            setDescription(metadata.data["description"] || "");
            setSymbol(metadata.data["symbol"] || "");
            setAttributes(metadata.data["attributes"] || []);
            setDomain(metadata.data["external_url"] || "");
            setSliderValue(Number(metadata.data["external_url"]) || 0);
            setImageMetadata(metadata.data["image"] || null);
            if (collectionRes) {
              setCollection(collectionRes);
            } else {
              setCollection(null);
            }

            //
            setAdressValid(true);
          }
        }
      } else {
        enqueueSnackbar("Asset not found.", { variant: "error" });
      }
    } else {
      enqueueSnackbar("Invalid Address input.", { variant: "error" });
    }
  };
  return (
    <>
      <div className="panel-container flex-column-center-center">
        <div className="font-h3">Edit a CORE Asset</div>
        <div className="address-validator flex-row-start-center">
          <input
            type="text"
            name="title"
            placeholder="Address of your asset"
            className="font-text-small"
            onChange={(e) => {
              setAddress(e.target.value);
              /* setValidatorInput(e.target.value); */
            }}
          />
          <div className="button-base">
            <button
              className="button flex-row-center-center font-text-tiny-bold"
              onClick={findAsset}
            >
              Verify adress
            </button>
          </div>
        </div>
        <div
          id="panel-nft"
          className={
            adressValid
              ? "panel flex-row-center-start"
              : "panel flex-row-center-start disabled"
          }
        >
          <div className="form flex-column-center-start">
            <input
              type="text"
              name="title"
              placeholder="Name"
              className="font-text-small"
              value={title}
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
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <input
              type="text"
              name="domain"
              placeholder="domain (optional)"
              className="font-text-small"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
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
              {imageMetadata &&
                (image ? (
                  <img src={imagePreview} alt="image-preview" />
                ) : (
                  <div className="placeholder font-text-small">
                    click here to import a new image
                  </div>
                ))}
              {!imageMetadata &&
                (image ? (
                  <img src={imagePreview} alt="image-preview" />
                ) : (
                  <div className="placeholder font-text-small">
                    click here to import an image
                  </div>
                ))}
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
              disabled={
                !title || !symbol || !description || (!image && !imageMetadata)
              }
              onClick={run}
            >
              {!title || !symbol || !description || (!image && !imageMetadata)
                ? "fill out missing fields"
                : "update"}
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
