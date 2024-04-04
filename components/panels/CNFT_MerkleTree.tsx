"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { CustomSlider } from "@/components/Slider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createMerkleTree } from "@/backend/CNFT";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";

export default function Panel() {
  const [size, setSize] = useState<number>();
  const [visibility, setVisibility] = useState<boolean>();
  const [merkleTree, setMerkleTree] = useState<string>();

  const [result, setResult] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { wallet } = useWallet();
  const { connection } = useConnection();
  useEffect(() => {}, []);

  const run = async () => {
    if (wallet) {
      try {
        const merkleTree = await createMerkleTree({
          connection,
          wallet,
          size: size,
          visibility: visibility,
        });
        if (merkleTree.success) {
          setMerkleTree(merkleTree.merkleTree);
          setSuccess(true);
          setResult(true);
        } else {
          setSuccess(false);
          setResult(true);
        }
      } catch (e) {
        console.log(e);
        enqueueSnackbar(
          "Transaction failed. Check your funds and connection.",
          { variant: "error" }
        );
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
          <div className="font-h3">Create a Merkle Tree</div>
          <m.div id="lab-panel-nft" className="panel flex-row-center-center">
            <m.div className="form flex-column-center-center">
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
            </m.div>
          </m.div>
        </m.div>

        {result && success && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            id="result-backdrop"
            className="flex-row-center-center"
          >
            <div id="result-panel" className="flex-column-center-center">
              <div className="headline flex-column-center-center">
                <FontAwesomeIcon icon={faCheckCircle} color="#0ba34b" />
                <div className="message font-h4">Success!</div>
              </div>
              <div className="buttons flex-column-center-center">
                <div className="button-base">
                  <Link
                    href={"https://solana.fm/address/" + merkleTree}
                    target="_blank"
                  >
                    <button className="button font-text-tiny-bold flex-row-center-center">
                      Open in Explorer
                    </button>
                  </Link>
                </div>
                <div className="button-base">
                  <Tooltip title={"Copy " + merkleTree}>
                    <button
                      className="button font-text-tiny-bold flex-row-center-center"
                      onClick={() => {
                        navigator.clipboard.writeText(merkleTree);
                      }}
                    >
                      Copy Address
                    </button>
                  </Tooltip>
                </div>
                <div className="button-base close">
                  <button
                    className="button close font-text-tiny-bold flex-row-center-center"
                    onClick={() => {
                      setResult(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </m.div>
        )}
        {result && !success && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            id="result-backdrop"
            className="flex-row-center-center"
          >
            <div id="result-panel" className="flex-column-center-center">
              <div className="headline flex-column-center-center">
                <FontAwesomeIcon icon={faXmarkCircle} color="#d40f1c" />
                <div className="message font-h4">Something went wrong.</div>
              </div>
              <div className="buttons flex-column-center-center">
                <div className="button-base close">
                  <button
                    className="button close font-text-tiny-bold flex-row-center-center"
                    onClick={() => {
                      setResult(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
