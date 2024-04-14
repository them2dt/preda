"use client";
import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { burnCNFT } from "@/backend/CNFT";
import { backendWrapper } from "../BackendWrapper";
import ResultPanel from "../ResultPanel";
import { BackendResponse } from "@/types";

export default function Panel() {
  const [validatorInput, setValidatorInput] = useState<string>();
  const [result, setResult] = useState<BackendResponse>({ status: 0 });

  const { wallet } = useWallet();
  const { connection } = useConnection();

  const run = async () => {
    if (!/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(validatorInput)) {
      enqueueSnackbar("Invalid public key.", { variant: "error" });
    } else {
      const runner = burnCNFT({ wallet, connection, assetId: validatorInput });
      const response = await backendWrapper({
        initialMessage: "Burning CNFT",
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
        <div className="font-h3">Burn a compressed NFT</div>
        <div className="panel flex-column-start-center">
          <input
            type="text"
            name="title"
            placeholder="Address of your asset"
            className="font-text-small"
            onChange={(e) => {
              setValidatorInput(e.target.value);
            }}
          />
          <div className="button-base">
            <button
              disabled={!wallet || !connection || !validatorInput}
              className="submit flex-row-center-center font-text-tiny-bold"
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
