"use client";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import React, { useState } from "react";

//Form components
import {
  TextField,
  TextArea,
  NumberField,
  Slidable,
  ImageInput,
} from "@/components/ultra/InputFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { BackendResponse } from "@/types";
import { CustomSlider } from "@/components/Slider";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

export default function Ultra({
  id,
  panel,
}: {
  id: number;
  panel: React.JSX.Element;
}) {
  const themes = ["light", "dark", "candy", "navy"];
  const [theme, setTheme] = useState(0);

  const types = [
    "Standard",
    "Programmable",
    "Compressed",
    "CORE",
    "SPL20",
    "SPL22",
  ];
  //TYPE SELECTOR
  const [tokenType, setTokenType] = useState<number>(0);
  const [fungibleType, setFungibleType] = useState<number>(0);
  const [nonFungibleType, setNonFungibleType] = useState<number>(0);
  const [formTemplate, setFormTemplate] = useState<{
    nftPanel: boolean;
    tokenExtensionsPanel: boolean;
    pluginsPanel: boolean;
  }>();
  //form-hooks
  const [name, setName] = useState<string>();
  const [symbol, setSymbol] = useState<string>("");
  const [domain, setDomain] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [royalty, setRoyalty] = useState<number>(0);
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
  const [result, setResult] = useState<BackendResponse>();

  const { wallet } = useWallet();
  const { connection } = useConnection();

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
  return (
    <div data-theme={themes[theme]}>
      <div id="ultra" className="flex-column-start-center">
        <div className="palette flex-column-center-start">
          <div className="type-selectors flex-row-center-center">
            <div className="type-selector types flex-row-center-center">
              {types.map((item, index) => (
                <button
                  className={
                    tokenType == index
                      ? "type font-text-small-bold active"
                      : "type font-text-small"
                  }
                  key={"type-" + index}
                  onClick={() => {
                    setTokenType(index);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="forms flex-row-start-start">
            <div className="column flex-column-center-center">
              <div className="form image flex-column-center-center">
                <ImageInput
                  image={image}
                  setImage={setImage}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              </div>

              <div className="form attributes flex-column-center-center">
                <button
                  className="creators-button font-text"
                  onClick={() => {
                    setAttributeModal(true);
                  }}
                >
                  Add attributes
                </button>
              </div>
            </div>
            <div className="column flex-column-center-center">
              <div className="form primary-info flex-column-center-center">
                <TextField
                  label={"Name"}
                  setValue={(e: string) => {
                    setName(e);
                  }}
                />

                <TextField
                  label={"URL"}
                  setValue={(e: string) => {
                    setDomain(e);
                  }}
                />
                <TextArea
                  label={"Description"}
                  setValue={(e: string) => {
                    setDescription(e);
                  }}
                />
              </div>
              <div className="form royalties flex-column-center-center">
                <Slidable
                  label="royalties"
                  min={0}
                  max={100}
                  steps={1}
                  value={royalty}
                  setValue={(i: number) => setRoyalty(i)}
                />
                <button
                  className="creators-button font-text"
                  onClick={() => {
                    setCreatorModal(true);
                  }}
                >
                  Add creators
                </button>
              </div>
            </div>
          </div>
        </div>
        <button className="submit font-h4">Create</button>
      </div>
      <Header id={id} theme={theme} themes={themes} />
      <Navigation
        theme={theme}
        themes={themes}
        toggleTheme={(themeIdParameter: number) => setTheme(themeIdParameter)}
      />

      {attributeModal && (
        <div
          className="backdrop flex-column-center-center"
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
          className="backdrop flex-column-center-center"
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
    </div>
  );
}
