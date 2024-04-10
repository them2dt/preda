"use client";
import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { burnPNFT } from "@/backend/PNFT";
import { backendWrapper } from "../BackendWrapper";
import { BackendResponse } from "@/types";
import ResultPanel from "../ResultPanel";

export default function Panel() {
  const [validatorInput, setValidatorInput] = useState<string>();
  const [inputValid, setInputValid] = useState(false);
  const [result, setResult] = useState<BackendResponse>();

  const { wallet } = useWallet();
  const { connection } = useConnection();

  const validatePublicKey = async (pubkey: string) => {
    if (!/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(validatorInput)) {
      enqueueSnackbar("Invalid public key.", { variant: "error" });
    } else {
      const runner = burnPNFT({
        connection: connection,
        wallet: wallet,
        assetId: validatorInput,
      });

      const response = await backendWrapper({
        initialMessage: "Burning PNFT",
        wallet: wallet,
        connection: connection,
        backendCall: async () => await runner,
      });
      setResult(response);
    }
  };
  return (
    <>
      <div className="panel-container flex-column-center-center">
        <div className="font-h3">Burn a programmable NFT</div>
        <div className="address-validator flex-row-start-center">
          <input
            type="text"
            name="title"
            placeholder="Address of your asset"
            className="font-text-small"
            onChange={(e) => {
              setInputValid(false);
              setValidatorInput(e.target.value);
            }}
          />
          <div className="button-base">
            <button
              disabled={!wallet || !connection || !validatorInput}
              className="button flex-row-center-center font-text-tiny-bold"
              onClick={async () => {
                await validatePublicKey(validatorInput);
              }}
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
