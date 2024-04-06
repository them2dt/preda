"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faX,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { CustomSlider } from "@/components/Slider";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { enqueueSnackbar } from "notistack";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { findMerkleTree, mintCNFT } from "@/backend/CNFT";
import { publicKey } from "@metaplex-foundation/umi";
import { Tooltip } from "@mui/material";
import Link from "next/link";

export default function Panel() {
  const [attributeModal, setAttributeModal] = useState(false);
  //rerenders the attribute-modal on every change.
  const [renderHook, setRenderHook] = useState<number>(0);
  //sets the title of NFT.
  const [title, setTitle] = useState<string>();
  //sets the symbol of NFT.
  const [symbol, setSymbol] = useState<string>();
  //sets the description of NFT.
  const [description, setDescription] = useState<string>();
  //sets the image of NFT.
  const [image, setImage] = useState();
  //sets the image-preview of NFT.
  const [imagePreview, setImagePreview] = useState();
  //sets the title of NFT.
  const [sliderValue, setSliderValue] = useState<number>(0);
  // hooks to store the key and value of the attribute to be added.
  const [attributeKey, setAttributeKey] = useState<string>();
  const [attributeValue, setAttributeValue] = useState<string>();
  // a hook with the type of an array of objects, which contains the key and value of the attribute.
  const [attributes, setAttributes] =
    useState<{ key: string; value: string }[]>();

  const [merkleTree, setMerkleTree] = useState<string>();
  const [foundMerkleTree, setFoundMerkleTree] = useState(false);

  const [resultAddress, setResultAddress] = useState<string>();
  const [result, setResult] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const removeAttribute = (index: number) => {
    const oldArray = attributes;
    if (oldArray) {
      oldArray.splice(index, 1);
      console.log(oldArray);
    }
  };

  const { wallet } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {}, []);

  //run methode wo die hauptfunktionen drin sind
  const run = async () => {
    if (!wallet || !connection || !title || !symbol || !description || !image) {
      enqueueSnackbar("Fill out the empty fields.", {
        variant: "error",
      });
    } else {
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
            creators: [
              {
                address:
                  wallet.adapter.publicKey?.toBase58() ||
                  "DFoRBzY3odkJ53FgCeSj26Ps6Bk7tuZ5kaV47QsyrqnV",
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
        if (!metadataUri) {
          enqueueSnackbar("Metadata upload failed.", { variant: "error" });
          return;
        }

        console.log("Creating CNFT...");
        const mint = await mintCNFT({
          wallet: wallet,
          connection: connection,
          title: title,
          metadata: metadataUri,
          sellerFeeBasisPoints: sliderValue,
          merkleTree: publicKey(merkleTree),
        });

        if (mint) {
          enqueueSnackbar("Created cNFT successfully.", { variant: "success" });
        }
      } else {
        enqueueSnackbar("Image upload failed.", { variant: "error" });
        return;
      }
    }
  };

  const validatePublicKey = async (pubkey: string) => {
    if (/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(pubkey)) {
      const found = await findMerkleTree({
        connection: connection,
        wallet: wallet,
        merkleTree: publicKey(pubkey),
      });
      if (found) {
        setFoundMerkleTree(true);
        enqueueSnackbar("Found MerkleTree!", { variant: "success" });
      }

      return found;
    } else {
      enqueueSnackbar("Invalid public key.", { variant: "error" });
      return false;
    }
  };
  return (
    <>
      <div className="panel-container flex-column-center-center">
        <div className="font-h3">Mint a compressed NFT</div>
        <div className="address-validator flex-row-start-center">
          <input
            type="text"
            name="title"
            placeholder="Address of your merkle tree"
            className="font-text-small"
            onChange={(e) => {
              setFoundMerkleTree(false);
              setMerkleTree(e.target.value);
            }}
          />
          <div className="button-base">
            <button
              disabled={!wallet || !connection || !merkleTree}
              className="button flex-row-center-center font-text-tiny-bold"
              onClick={async () => {
                await validatePublicKey(merkleTree);
              }}
            >
              Verify Merkle Tree
            </button>
          </div>
        </div>
        <div
          id="lab-panel-nft"
          className={
            foundMerkleTree
              ? "panel flex-row-center-center"
              : "panel disabled flex-row-center-center"
          }
        >
          {/**Every operation is done in here.*/}
          <div className="editor">
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
                placeholder="Symbol"
                className="font-text-small"
                onChange={(e) => {
                  setSymbol(e.target.value);
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
                className="attributes-button font-text"
                onClick={() => {
                  setAttributeModal(true);
                }}
              >
                add attributes
              </div>
            </div>
          </div>
          {/**Shows a preview of the NFT */}
          <div className="preview">
            <div className="content">
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
                      validateImage(
                        e.target.files[0],
                        setImage,
                        setImagePreview
                      );
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
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("clicked.");
                    removeAttribute(index);
                    setRenderHook(renderHook + 1);
                  }}
                >
                  <div className="key font-text-bold">{attribute.key}</div>

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
                        key: attributeKey || "",
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
