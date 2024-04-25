"use client";
import { ImageInput, TextArea, TextField } from "@/components/ui/InputFields";
import SidePanel from "@/components/ui/SidePanel";
import { themes } from "@/components/utils/simples";
import { BackendResponse } from "@/types";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useState } from "react";

export default function page() {
  const [theme, setTheme] = useState(0);
  const [rpc, setRpc] = useState(clusterApiUrl("devnet"));
  //

  const [title, setTitle] = useState<string>();
  const [symbol, setSymbol] = useState<string>("");
  const [domain, setDomain] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [collection, setCollection] = useState<string>();
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState();
  const [sliderValue, setSliderValue] = useState<number>(0);
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
  return (
    <>
      <div 
        className="full-page-container flex-row-end-start"
        data-theme={themes[theme]}
      >
        <div className="content flex-column-center-center">
          <div className="form flex-column-center-center">
            <div className="row flex-row-center-center">
              <div className="column flex-column-center-center">
                <ImageInput
                  image={image}
                  setImage={setImage}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
                <TextField label="Name" setValue={setTitle} />
                <TextField label="Symbol" setValue={setSymbol} />
                <TextField label="Domain" setValue={setDomain} />
                <TextArea label="Description" setValue={setTitle} />
              </div>
            </div>
            <button className="submit font-h4">Create</button>
          </div>
        </div>
      </div>
      <SidePanel
        sectionID={0}
        operationID={0}
        theme={theme}
        setTheme={setTheme}
        rpc={rpc}
        setRpc={setRpc}
      />
    </>
  );
}
