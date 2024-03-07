"use client";
import React, { useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { CustomSlider } from "@/components/ui/Slider";
import { validateImage } from "@/backend/General";

export default function CreateNFTPanel() {
  const [attributeModal, setAttributeModal] = useState(false);
  //rerenders the attribute-modal on every change.
  const [renderHook, setRenderHook] = useState(0);
  //sets the title of NFT.
  const [title, setTitle] = useState("-");
  //sets the symbol of NFT.
  const [symbol, setSymbol] = useState("-");
  //sets the description of NFT.
  const [description, setDescription] = useState("-");
  //sets the image of NFT.
  const [image, setImage] = useState();
  //sets the image-preview of NFT.
  const [imagePreview, setImagePreview] = useState();
  //sets the title of NFT.
  const [sliderValue, setSliderValue] = useState(0);
  // a hook with the type of an array of objects, which contains the key and value of the attribute.

  const [attributes, setAttributes] = useState(
    [] as { key: string; value: string }[]
  );
  //hooks to store the key and value of the attribute to be added.
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  //a function called, which pops an item in the array of attributes at a given index and sets the new array of attributes
  const removeAttribute = (index: number) => {
    const oldArray = attributes;
    oldArray.splice(index, 1);
    console.log(oldArray);
  };

  return (
    <>
      <AnimatePresence>
        <m.div
          className="panel create"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {/**Every operation is done in here.*/}
          <m.div className="editor">
            <m.div className="form">
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
                  <div className="font-text-small-bold">{sliderValue}%</div>
                </div>
                <div className="slider-container">
                  <CustomSlider
                    min={0}
                    max={20}
                    step={1}
                    value={sliderValue}
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
              <m.div
                className="attributes-button font-text"
                onClick={() => {
                  setAttributeModal(true);
                }}
              >
                add attributes
              </m.div>
            </m.div>
          </m.div>
          {/**Shows a preview of the NFT */}
          <m.div className="preview">
            <m.div className="content">
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
              <m.div className="submit font-text-bold">create</m.div>
            </m.div>
          </m.div>
        </m.div>
        {attributeModal && (
          <m.div
            className="backdrop"
            id="backdrop"
            onClick={() => {
              setAttributeModal(false);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <m.div
              className="attributes"
              onClick={(e) => {
                e.stopPropagation();
              }}
              key={renderHook}
            >
              {attributes.map((attribute, index) => {
                return (
                  <m.div
                    className="attribute"
                    key={index}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    transition={{ delay: 0.1, duration: 0.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("clicked.");
                      removeAttribute(index);
                      setRenderHook(renderHook + 1);
                    }}
                  >
                    <div className="key font-text-bold">{attribute.key}</div>

                    <div className="line"></div>
                    <div className="value font-text-light">
                      {attribute.value}
                    </div>
                  </m.div>
                );
              })}
            </m.div>
            {/*Modal component. Frames the modal content.*/}
            <m.div
              className="modal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.1, duration: 0.1 }}
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
                        setKey(e.target.value);
                      }}
                    />
                    <input
                      type="text"
                      className="value font-text"
                      placeholder="value"
                      required
                      onChange={(e) => {
                        setValue(e.target.value);
                      }}
                    />
                  </div>
                  <button
                    className="submit font-text"
                    type="submit"
                    disabled={!key || !value}
                    onClick={() => {
                      setAttributes([
                        ...attributes,
                        { key: key, value: value },
                      ]);
                    }}
                  >
                    {!key || !value ? "fill in the fields" : "add"}
                  </button>
                </form>
              </div>
            </m.div>
            {/* Button with x symbol */}
            <button
              onClick={() => setAttributeModal(false)}
              className="close-button"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
