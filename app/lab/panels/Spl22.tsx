"use client";
import { validateImage } from "@/backend/General";
import { AnimatePresence, motion as m } from "framer-motion";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

export default function Panel() {
  //sets the title of Token.
  const [title, setTitle] = useState<string>();
  //sets the symbol of Token.
  const [symbol, setSymbol] = useState<string>();
  //sets the description of Token.
  const [description, setDescription] = useState<string>();
  //sets the image of Token.
  const [image, setImage] = useState();
  //sets the image-preview of Token.
  const [imagePreview, setImagePreview] = useState();
  // a hook with the type of an array of objects, which contains the key and value of the attribute.

  const run = () => {
    if (!title || !symbol || !description || !image) {
      enqueueSnackbar("Fill out the empty fields.", {
        variant: "error",
      });
    } else {
      console.log("Creating the NFT function.");
      //TODO
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
                    <img src={imagePreview} />
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
                      <input type="checkbox" name="burnable" id="burnable" />
                    </div>
                  </div>
                  <div className="extension flex-column-center-center">
                    <label htmlFor="burnable">Transfer tax (%)</label>
                    <input
                      type="number"
                      name="burnable"
                      min={0}
                      max={100}
                      defaultValue={0}
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
                      defaultValue={0}
                      prefix={"%"}
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
