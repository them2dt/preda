"use client";
import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { burnNFT } from "@/components/backend/NFT";

export default function Panel() {
  const [validatorInput, setValidatorInput] = useState<string>();
  const [inputValid, setInputValid] = useState(false);

  const { wallet } = useWallet();
  const { connection } = useConnection();

  const validatePublicKey = async (pubkey: string) => {
    if (/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(pubkey)) {
      try{
      await burnNFT({
        connection: connection,
        wallet: wallet,
        assetId: validatorInput,
      }).then((result) => {
        if (result.signature) {
          enqueueSnackbar("Burnt asset successfully.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Couldn't burn asset. Is it a standard NFT?", {
            variant: "error",
          });
        }
      });
      }catch(e){

        enqueueSnackbar("Something went wrong", {
          variant: "error",
        });
      }
    }
  };
  return (
    <>
      <div className="panel-container flex-column-center-center">
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
