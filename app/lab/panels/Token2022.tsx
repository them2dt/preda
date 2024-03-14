import React, { useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { CustomSlider } from "@/components/ui/Slider";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { enqueueSnackbar } from "notistack";
import { createToken22, burnToken22 } from "@/backend/Token22";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export default function Panel() {
  const { wallet } = useWallet();
  const { connection } = useConnection();

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
  const [image, setImage] = useState<File>();
  //sets the image-preview of NFT.
  const [imagePreview, setImagePreview] = useState<string>();
  //sets the title of NFT.
  const [sliderValue, setSliderValue] = useState<number>(0);
  // hooks to store the key and value of the attribute to be added.
  const [key, setKey] = useState<string>();
  const [value, setValue] = useState<string>();
  // a hook with the type of an array of objects, which contains the key and value of the attribute.
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>();
  //hooks to store the key and value of the attribute to be added.
  const removeAttribute = (index: number) => {
    const oldArray = attributes;
    if (oldArray) {
      oldArray.splice(index, 1);
      console.log(oldArray);
    }
  };

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
        const tokenMintAddress = await createToken22({
          wallet,
          connection: connection,
          name: title,
          symbol: symbol,
          decimals: 9, // Set the number of decimals
          uri: imageUri, // Use the image URL as the token's URI
        });

        if (tokenMintAddress) {
          enqueueSnackbar("Token created!", { variant: "success" });
        } else {
          enqueueSnackbar("Error creating token.", { variant: "error" });
        }
      } else {
        enqueueSnackbar("Image upload failed.", { variant: "error" });
      }
    }
  };

  return (
    <>
      <div className="flex-column-center-center form-container">
        <div className="flex-row-center-start form">
          <div className="flex-column-center-center text-inputs">
            <input
              type="text"
              name="title"
              placeholder="Name"
              className="font-text-small"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              name="symbol"
              placeholder="Symbol"
              className="font-text-small"
              onChange={(e) => setSymbol(e.target.value)}
            />
            <textarea
              name="description"
              placeholder="Description"
              className="font-text-small"
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="file"
              accept="image/png"
              id="image-input"
              onChange={(e) => {
                if (e.target.files) {
                  setImage(e.target.files[0]);
                  setImagePreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            <label htmlFor="image-input" className="image-input-label">
              {imagePreview ? (
                <img src={imagePreview} alt="Token Preview" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                <FontAwesomeIcon icon={["fas", "image"]} className="font-text-small" />                  <div>Click to upload an image</div>
                </div>
              )}
            </label>
          </div>
          <div className="flex-column-center-center actions">
            <CustomSlider
              value={sliderValue}
              setValue={setSliderValue}
              min={0}
              max={1000}
              step={50}
              label="Seller Fee Basis Points"
            />
            <button className="submit font-text-bold" disabled={!title || !symbol || !description || !image} onClick={run}>
              Create Token
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
