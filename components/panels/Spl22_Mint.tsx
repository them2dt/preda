"use client";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { AnimatePresence, motion as m } from "framer-motion";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { createSPL22 } from "@/backend/SPL22";
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

  const { wallet } = useWallet();
  const { connection } = useConnection();
  useEffect(() => {
    if (wallet.adapter.connected) {
      enqueueSnackbar("Wallet connected.", { variant: "success" });
    } else enqueueSnackbar("Wallet not connected.", { variant: "error" });
  }, []);

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

      const res = await createSPL22({
        wallet: wallet,
        connection: connection,
        title: title,
        symbol: symbol,
        decimals: decimals,
        metadata: imageUri,
        sellerFeeBasisPoints: 0,
        supply: supply * 10 ** decimals,
      });

      if (res.success) {
        enqueueSnackbar("Token created.", { variant: "success" });
        console.log("Public Key: " + res.pubkey);
      } else {
        enqueueSnackbar("Error creating token.", { variant: "error" });
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        <m.div
          className="panel-container flex-column-center-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="font-h3">Mint SPL22-Tokens</div>
          <m.div id="lab-panel-spl" className="panel flex-row-center-center">
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
                      setSupply(Number(e.target.value));
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
                      setDecimal(Number(e.target.value));
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
        </m.div>
      </AnimatePresence>
    </>
  );
}
