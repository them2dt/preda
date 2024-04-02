"use client";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { AnimatePresence, motion as m } from "framer-motion";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { createSPL22 } from "@/backend/SPL22";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export default function Panel() {
  const [title, setTitle] = useState<string>();
  const [symbol, setSymbol] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [supply, setSupply] = useState<number>(0);
  const [decimals, setDecimals] = useState<number>(0);
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  //Token extensions
  const [frozen, setFrozen] = useState<boolean>(false);
  const [transferTax, setTransferTax] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [authority, setAuthority] = useState<string>();

  const { wallet } = useWallet();
  const { connection } = useConnection();
  const run = async () => {
    try {
      const imageUri = await uploadFileToIrys({
        wallet: wallet,
        connection: connection,
        file: image,
      });
      const metadata = {
        name: title,
        image: imageUri,
        symbol: symbol,
        description: description,
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
      const res = await createSPL22({
        wallet: wallet,
        connection: connection,
        title: title,
        symbol: symbol,
        metadata: metadataUri,
        decimals: decimals,
        sellerFeeBasisPoints: 0,
        supply: supply * 10 ** decimals,
      });

      if (res.success) {
        enqueueSnackbar("Token created.", { variant: "success" });
        console.log(res.pubkey);
      } else {
        enqueueSnackbar("Error creating token.", { variant: "error" });
      }
    } catch (e) {
      enqueueSnackbar("Something went wrong.", { variant: "error" });
      console.log("Error at creating a SPL22: " + e);
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
          <div className="font-h3">Create a SPL22-Token</div>
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
                    placeholder="Initial Supply"
                    min={0}
                    max={1000000000000}
                    className="font-text-small"
                    onChange={(e) => {
                      setSupply(Number(e.target.value));
                    }}
                  />
                  <input
                    type="number"
                    name="decimals"
                    placeholder="Decimals"
                    min={0}
                    max={18}
                    className="font-text-small"
                    onChange={(e) => {
                      setDecimals(Number(e.target.value));
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
          </m.div>
        </m.div>
      </AnimatePresence>
    </>
  );
}
