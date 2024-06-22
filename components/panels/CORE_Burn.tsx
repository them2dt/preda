"use client";
import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { burnNFT } from "@/backend/NFT";
import { burnAsset, fetchAsset } from "@/backend/CORE";

export default function Panel() {
  const [validatorInput, setValidatorInput] = useState<string>();
  const [collection, setCollection] = useState<string>();

  const { wallet } = useWallet();
  const { connection } = useConnection();

  const validatePublicKey = async () => {
    if (/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(validatorInput)) {
      await fetchAsset({
        connection: connection,
        wallet: wallet,
        assetId: validatorInput,
      }).then(async (result) => {
        if (result) {
          await burnAsset({
            connection: connection,
            wallet: wallet,
            assetId: result.assetID,
            collection: /[1-9A-HJ-NP-Za-km-z]{32,44}/.test(collection)
              ? collection
              : null,
          }).then((res) => {
            if (res.signature) {
              enqueueSnackbar("Burnt asset successfully.", {
                variant: "success",
              });
            }else{
              enqueueSnackbar("Did't burn asset. Is it a CORE Asset?", {
                variant: "error",
              });
            }
          });
        } else {
          enqueueSnackbar("Couldn't burn asset. Is it a CORE Asset?", {
            variant: "error",
          });
        }
      });
    }
  };
  return (
    <>
      <div className="panel-container flex-column-center-center">
        <div className="font-h3">Burn a CORE Asset</div>
        <div className="address-validator flex-row-start-center">
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
              onClick={async () => {
                await validatePublicKey();
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
