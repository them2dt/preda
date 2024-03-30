"use client";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { AnimatePresence, motion as m } from "framer-motion";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { createToken22 } from "@/backend/SPL22";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { create } from "domain";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faClose } from "@fortawesome/free-solid-svg-icons";

export default function Panel() {
  //sets the title of Token.
  const [title, setTitle] = useState<string>();
  //sets the symbol of Token.
  const [symbol, setSymbol] = useState<string>();
  //sets the description of Token.
  const [description, setDescription] = useState<string>();
  //sets the total supply of Token.
  const [supply, setSupply] = useState<number>(0);
  //sets the decimals of the Token.
  const [decimals, setDecimal] = useState<number>(0);
  //sets the image of Token.
  const [image, setImage] = useState();
  //sets the image-preview of Token.
  const [imagePreview, setImagePreview] = useState();
  //token extensions
  const [frozen, setFrozen] = useState<boolean>(false);
  const [transferTax, setTransferTax] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [authority, setAuthority] = useState<string>();

  const { wallet } = useWallet();
  const { connection } = useConnection();
  const run = async () => {
    if (!wallet || !connection || !title || !symbol || !description || !image) {
      enqueueSnackbar("Fill out the empty fields.", {
        variant: "error",
      });
    } else {
      console.log("Creating the SPL22.");

      enqueueSnackbar("Uploading image...", { variant: "info" });
      const imageUri = await uploadFileToIrys({
        wallet: wallet,
        connection: connection,
        file: image,
      });

      const res = await createToken22({
        wallet: wallet,
        connection: connection,
        name: title,
        symbol: symbol,
        decimals: 0,
        metadata: imageUri,
        sellerFeeBasisPoints: 0,
        amount: 0,
      });

      if (res) {
        enqueueSnackbar("Token created.", { variant: "success" });
        console.log(res);
      } else {
        enqueueSnackbar("Error creating token.", { variant: "error" });
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
                </m.div>
              </div>
            </div>
            <div className="extensions-row flex-column-center-start">
              <div className="extensions flex-column-center-start">
                <div className="extension flex-row-center-center">
                  <label htmlFor="burnable">Frozen</label>
                  <div className="checkbox-container flex-row-center-center">
                    <input
                      type="checkbox"
                      name="burnable"
                      id="burnable"
                      onChange={(e) => {
                        setFrozen(e.target.checked);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="burnable"
                    placeholder="Authority"
                    className="extension-input font-text-tiny"
                    value={authority}
                    onChange={(e) => {
                      setAuthority(e.target.value);
                    }}
                  />
                </div>
                <div className="extension flex-row-center-center">
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
                  <input
                    type="text"
                    name="burnable"
                    placeholder="Authority"
                    className="extension-input font-text-tiny"
                    value={authority}
                    onChange={(e) => {
                      setAuthority(e.target.value);
                    }}
                  />
                </div>
                <div className="extension flex-row-center-center">
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
                  <input
                    type="text"
                    name="burnable"
                    placeholder="Authority"
                    className="extension-input font-text-tiny"
                    value={authority}
                    onChange={(e) => {
                      setAuthority(e.target.value);
                    }}
                  />
                </div>
              </div>
              <button
                className="submit font-text-bold flex-row-center-center"
                disabled={!title || !symbol || !description || !image}
                onClick={run}
              >
                {!title || !symbol || !description || !image
                  ? "Fill out the empty fields."
                  : "Create SPL22"}
              </button>
            </div>
          </div>
        </m.div>
      </AnimatePresence>
    </>
  );
}
