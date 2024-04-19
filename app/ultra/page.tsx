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

export default function Ultra({
  id,
  panel,
}: {
  id: number;
  panel: React.JSX.Element;
}) {
  const themes = ["light", "dark", "candy", "navy"];
  const [theme, setTheme] = useState(0);

  const tokenTypes = ["SPL-Token", "NFT"];
  const fungibleTypes = ["SPL-20", "SPL-22"];
  const nonFungibleTypes = ["Standard", "Programmable", "Compressed", "CORE"];
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
  const [description, setDescription] = useState<string>();
  const [royalty, setRoyalty] = useState<number>(0);
  const [domain, setDomain] = useState<string>();

  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  return (
    <div data-theme={themes[theme]}>
      <div id="ultra" className="flex-column-start-center">
        <div className="type-selectors flex-column-center-center">
          <div className="type-selector types flex-row-center-center">
            {tokenTypes.map((item, index) => (
              <button
                className={
                  tokenType == index
                    ? "type font-text active"
                    : "type font-text"
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
          {tokenType == 0 && (
            <div className="type-selector types flex-row-center-center">
              {nonFungibleTypes.map((item, index) => (
                <button
                  className={
                    nonFungibleType == index
                      ? "type font-text active"
                      : "type font-text"
                  }
                  key={"type-" + index}
                  onClick={() => {
                    setNonFungibleType(index);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
          {tokenType == 1 && (
            <div className="type-selector types flex-row-center-center">
              {fungibleTypes.map((item, index) => (
                <button
                  className={
                    fungibleType == index
                      ? "type font-text active"
                      : "type font-text"
                  }
                  key={"type-" + index}
                  onClick={() => {
                    setFungibleType(index);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="forms">
          <div className="form flex-column-center-center">
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
          <div className="form flex-column-center-center">
            <ImageInput
              image={image}
              setImage={setImage}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />
          </div>
          <div className="form flex-column-center-center">
            <Slidable
              label="royalties"
              min={0}
              max={100}
              steps={1}
              value={royalty}
              setValue={(i: number) => setRoyalty(i)}
            />
            <div className="input-field creators flex-column-center-center">
              <div className="creator flex-row-center-center">
                <input
                  type="text"
                  className="font-text"
                  onChange={() => {}}
                  onFocus={() => {}}
                  onBlur={() => {}}
                />
                <input type="text" className="font-text" onChange={(e) => {}} />
                <button className="pop">
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
              <button className="add">Add creators</button>
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
    </div>
  );
}
