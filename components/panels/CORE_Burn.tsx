"use client";
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { burnAsset, fetchAsset } from "@/backend/CORE";
import { backendWrapper } from "../BackendWrapper";
import { enqueueSnackbar } from "notistack";
import { BackendResponse } from "@/types";
import ResultPanel from "../ResultPanel";

export default function Panel() {
  const [validatorInput, setValidatorInput] = useState<string>();
  const [collection, setCollection] = useState<string>();
  const [result, setResult] = useState<BackendResponse>();

  const { wallet } = useWallet();
  const { connection } = useConnection();

  const run = async () => {
    if (!/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(validatorInput)) {
      enqueueSnackbar("Invalid public key.", { variant: "error" });
    } else {
      const runner = burnAsset({
        connection: connection,
        wallet: wallet,
        assetId: validatorInput,
        collection: /[1-9A-HJ-NP-Za-km-z]{32,44}/.test(collection)
          ? collection
          : null,
      });

      const response = await backendWrapper({
        initialMessage: "Burning CORE",
        wallet: wallet,
        connection: connection,
        backendCall: async () => await runner,
      });
      setResult(response);
    }
  };
  return (
    <>
      <div className="panel-container flex-column-start-center">
        <div className="font-h3">Burn a CORE Asset</div>
        <div className="panel flex-row-start-center">
          <input
            type="text"
            name="title"
            placeholder="Address of your asset"
            className="font-text-small"
            onChange={(e) => {
              setValidatorInput(e.target.value);
            }}
          />
          <input
            type="text"
            name="title"
            placeholder="Address of your collection (optional)"
            className="font-text-small"
            onChange={(e) => {
              setCollection(e.target.value);
            }}
          />
          <div className="button-base">
            <button
              disabled={!wallet || !connection || !validatorInput}
              className="button flex-row-center-center font-text-tiny-bold"
              onClick={run}
            >
              Burn Asset
            </button>
          </div>
        </div>
      </div>
      {result && <ResultPanel result={result} setResult={setResult} />}
    </>
  );
}
