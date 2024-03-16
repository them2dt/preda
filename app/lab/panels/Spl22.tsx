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

  const [frozen, setFrozen] = useState<boolean>(false);
  const [transferTax, setTransferTax] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [authority, setAuthority] = useState<string>();
  
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
      
      const rawData = {
        seller_fee_basis_points: sliderValue,
      };

      if (imageUri) {
        const tokenMintAddress = await createToken22({
          wallet,
          connection: connection,
          name: title,
          symbol: symbol,
          decimals: 9, // Set the number of decimals
          uri: imageUri, // Use the image URL as the token's URI
          rawData,
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
      <AnimatePresence>
        <m.div
          id="lab-panel-spl"
          className="panel create"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {/**Every operation is done in here.*/}
          <div className="flex-column-center-center form-container">
            <div className="flex-row-center-start form">
              <div className="flex-column-center-center text-inputs">
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
                <input
                  type="number"
                  name="supply"
                  min={0}
                  max={1000000000000}
                  placeholder="Supply"
                  className="font-text-small"
                  onChange={(e) => {
                    setSymbol(e.target.value);
                  }}
                />
                <input
                  type="number"
                  name="decimals"
                  min={0}
                  max={18}
                  placeholder="Decimals"
                  className="font-text-small"
                  onChange={(e) => {
                    setSymbol(e.target.value);
                  }}
                />
              </div>
              <div className="flex-column-center-center image-input">
                <m.div
                  className="image"
                  onClick={() => {
                    const imageInput = document.getElementById("image-input");
                    if (imageInput) {
                      imageInput.click();
                    }
                  }}
                >
                  {image ? (
                    <img src={imagePreview}  alt="image-preview"/>
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
                </m.div>
              </div>
            </div>
            <div className="flex-row-center-center extensions-container">
              <div className="extensions-column flex-column-center-center">
                <div className="extensions flex-row-center-start">
                  <div className="extension flex-column-center-center">
                    <div className="extension-check flex-column-center-center">
                      <label htmlFor="burnable">Frozen</label>
                      <input
                        type="checkbox"
                        name="burnable"
                        id="burnable"
                        onChange={(e) => {
                          setFrozen(e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                  <div className="extension flex-column-center-center">
                    <label htmlFor="burnable">Transfer tax (%)</label>
                    <input
                      type="number"
                      name="burnable"
                      min={0}
                      max={100}
                      value={transferTax}
                      onChange={(e) => {
                        setTransferTax(Number(e.target.value));
                      }}
                      placeholder="Transfer tax"
                      className="extension-input font-text-small"
                    />
                  </div>
                  <div className="extension flex-column-center-center">
                    <label htmlFor="burnable">Interest (%)</label>
                    <input
                      type="number"
                      name="burnable"
                      min={0}
                      max={100}
                      value={interest}
                      onChange={(e) => {
                        setInterest(Number(e.target.value));
                      }}
                      placeholder="Transfer tax"
                      className="extension-input font-text-small"
                    />
                  </div>
                </div>
                <div className="extensions flex-row-center-start">
                  <div className="extension flex-column-center-center">
                    <input
                      type="text"
                      name="burnable"
                      placeholder="authority"
                      className="extension-input font-text-small"
                      value={authority}
                      onChange={(e) => {
                        setAuthority(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <m.div className="content">
              <button
                className="submit font-text-bold"
                disabled={!title || !symbol || !description || !image}
                onClick={run}
              >
                {!title || !symbol || !description || !image
                  ? "fill out missing fields"
                  : "create"}
              </button>
            </m.div>
          </div>
        </m.div>
      </AnimatePresence>
    </>
  );
}
