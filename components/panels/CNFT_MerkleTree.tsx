"use client";
import React, { useEffect, useState } from "react";
import { CustomSlider } from "@/components/Slider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createMerkleTree } from "@/backend/CNFT";
import { Tooltip } from "@mui/material";
import { backendWrapper } from "../BackendWrapper";
import { BackendResponse } from "@/types";
import ResultPanel from "../ResultPanel";

export default function Panel() {
  const [size, setSize] = useState<number>();
  const [visibility, setVisibility] = useState<boolean>();
  const [result, setResult] = useState<BackendResponse>();

  const { wallet } = useWallet();
  const { connection } = useConnection();
  useEffect(() => {}, []);

  const run = async () => {
    const runner = createMerkleTree({
      connection,
      wallet,
      size: size,
      visibility: visibility,
    });

    const response = await backendWrapper({
      wallet: wallet,
      connection: connection,
      initialMessage: "",
      backendCall: async () => await runner,
    });

    setResult(response);
  };

  return (
    <>
      <div className="panel-container flex-column-center-center">
        <div className="font-h3">Create a Merkle Tree</div>
        <div id="lab-panel-nft" className="panel flex-row-center-center">
          <div className="form flex-column-center-center">
            <div className="visibility flex-row-between-center">
              <div className="legend font-text-small-bold">Public</div>
              <input
                type="checkbox"
                onChange={(e) => {
                  setVisibility(e.target.checked);
                }}
              />
            </div>
            <div className="royalties flex-column-center-center">
              <div className="legend flex-row-between-center">
                <Tooltip title="The amount of CNFTs which can be created on a tree.">
                  <div className="font-text-small-bold">Size</div>
                </Tooltip>
                <input
                  type="number"
                  name="size"
                  placeholder="Amount of NFTs"
                  className="font-text-small"
                  value={size}
                  onChange={(e) => {
                    setSize(parseInt(e.target.value));
                  }}
                />
              </div>
              <div className="slider-container">
                <CustomSlider
                  min={0}
                  max={1000000}
                  step={1}
                  value={size} // Fix: Change the type of sliderValue to number
                  onChange={(
                    event: Event,
                    value: number | number[],
                    activeThumb: number
                  ) => {
                    if (typeof value == "number") {
                      setSize(value);
                    }
                  }}
                />
              </div>
            </div>
            <button
              className="submit font-text-bold"
              disabled={!size}
              onClick={run}
            >
              {!size ? "fill out missing fields" : "create"}
            </button>
          </div>
        </div>
      </div>

      {result && <ResultPanel result={result} setResult={setResult} />}
    </>
  );
}
