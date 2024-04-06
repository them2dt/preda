"use client";
import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { burnPNFT } from "@/backend/PNFT";

export default function Panel() {
  const [validatorInput, setValidatorInput] = useState<string>();
  const [inputValid, setInputValid] = useState(false);

  const { wallet } = useWallet();
  const { connection } = useConnection();

  const validatePublicKey = async (pubkey: string) => {
    if (/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(pubkey)) {
      const result = await burnPNFT({
        connection: connection,
        wallet: wallet,
        assetId: validatorInput,
      });

      console.log(result);
      if (result == true) {
        enqueueSnackbar("Burnt asset successfully.", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Couldn't burn asset. Is it a programmable NFT?", {
          variant: "error",
        });
      }
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
    </>
  );
}