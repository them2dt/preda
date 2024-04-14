"use client";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { createAndMintSPL20 } from "@/backend/SPL20";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CustomSlider } from "../Slider";
import { backendWrapper } from "../BackendWrapper";
import { BackendResponse } from "@/types";
import ResultPanel from "../ResultPanel";

export default function Panel() {
  const [title, setTitle] = useState<string>();
  const [symbol, setSymbol] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [supply, setSupply] = useState<number>(0);
  const [decimals, setDecimals] = useState<number>(0);
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [result, setResult] = useState<BackendResponse>();

  const { wallet } = useWallet();
  const { connection } = useConnection();
  const run = async () => {
    if (supply * 10 ** decimals > BigInt("18000000000000000000")) {
      enqueueSnackbar(
        "Supply * (10 ^ decimals) can't exeed 18'000'000'000'000'000'000 (eighteen quintillion). Go to the help-page to learn more.",
        { variant: "warning" }
      );
    } else {
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
          image: imageUri,
          external_url: "emptea.xyz",
          properties: {
            files: [{ uri: imageUri, type: "image/png" }],
            category: "image",
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
          const runner = createAndMintSPL20({
            wallet: wallet,
            connection: connection,
            name: title,
            symbol: symbol,
            metadata: metadataUri,
            decimals: decimals,
            sellerFeeBasisPoints: 0,
            supply: supply,
          });

          const response = await backendWrapper({
            initialMessage: "Create SPL20",
            wallet: wallet,
            connection: connection,
            backendCall: async () => await runner,
          });
          setResult(response);
        } else {
          enqueueSnackbar("Metadata upload failed.", { variant: "error" });
        }
      } else {
        enqueueSnackbar("Image upload failed.", { variant: "error" });
      }
    }
  };

  return (
    <>
      <div className="panel-container flex-column-start-center">
        <div className="font-h3">Create a SPL20-Token</div>
        <div id="lab-panel-spl" className="panel create">
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
                <div className="royalties flex-column-center-center">
                  <div className="legend flex-row-between-center">
                    <div className="font-text-small">Decimals</div>
                    <div className="font-text-small-bold">
                      {decimals.toString()}
                    </div>
                  </div>
                  <div className="slider-container">
                    <CustomSlider
                      min={0}
                      max={18}
                      step={1}
                      onChange={(
                        event: Event,
                        value: number | number[],
                        activeThumb: number
                      ) => {
                        if (typeof value == "number") {
                          setDecimals(value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-column-center-center image-input">
                <div
                  className="image-preview flex-row-center-center"
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
              </div>
            </div>
            <button
              className="submit font-text-bold flex-row-center-center"
              disabled={!title || !symbol || !description || !image}
              onClick={run}
            >
              {!title || !symbol || !description || !image
                ? "Fill out the empty fields."
                : "Create SPL20"}
            </button>
          </div>
        </div>
      </div>
      {result && <ResultPanel result={result} setResult={setResult} />}
    </>
  );
}
