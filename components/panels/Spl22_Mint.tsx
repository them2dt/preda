"use client";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { AnimatePresence, motion as m } from "framer-motion";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { createSPL22, findSPL22, mintSPL22 } from "@/backend/SPL22";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { create } from "domain";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faClose } from "@fortawesome/free-solid-svg-icons";
import { publicKey } from "@metaplex-foundation/umi";
import { findMerkleTree } from "@/backend/CNFT";

export default function Panel() {
  const [supply, setSupply] = useState<number>(0);
  const [receipent, setReceipent] = useState<string>();

  //Adress validator
  const [validatorInput, setValidatorInput] = useState<string>();
  const [inputValid, setInputValid] = useState<boolean>(false);

  const { wallet } = useWallet();
  const { connection } = useConnection();
  useEffect(() => {
    if (wallet.adapter.connected) {
      enqueueSnackbar("Wallet connected.", { variant: "success" });
    } else enqueueSnackbar("Wallet not connected.", { variant: "error" });
  }, []);

  const run = async () => {
    if (!wallet || !connection || !supply || !receipent) {
      enqueueSnackbar("Fill out the empty fields.", {
        variant: "error",
      });
    } else {
      console.log("Minting the SPL22.");
      console.log("Mint: " + publicKey(validatorInput));
      const res = await mintSPL22({
        wallet: wallet,
        connection: connection,
        mint: publicKey(validatorInput),
        amount: supply,
      });

      if (res.success) {
        enqueueSnackbar("Token created.", { variant: "success" });
        console.log("Public Key: " + res.pubkey);
      } else {
        enqueueSnackbar("Error creating token.", { variant: "error" });
      }
    }
  };

  const validatePublicKey = async (pubkey: string) => {
    if (/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(pubkey)) {
      const found = await findSPL22({
        connection: connection,
        wallet: wallet,
        metadata: publicKey(pubkey),
      });
      if (found.status == 200) {
        setInputValid(true);
        enqueueSnackbar("Found Account!", { variant: "success" });
        return true;
      } else {
        enqueueSnackbar("Couldn't find account!", { variant: "error" });
        return false;
      }
    } else {
      enqueueSnackbar("Invalid public key.", { variant: "error" });
      return false;
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
          <div className="font-h3">Mint SPL22-Tokens</div>
          <div className="address-validator flex-row-start-center">
            <input
              type="text"
              name="title"
              placeholder="Address of your merkle tree"
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
                Verify Merkle Tree
              </button>
            </div>
          </div>
          <m.div
            id="lab-panel-spl"
            className="panel mint-panel flex-row-center-center"
          >
            <div className="flex-column-center-center form-container">
              <div className="flex-row-center-start form">
                <div className="flex-column-center-center text-inputs">
                  <input
                    type="text"
                    name="receipent"
                    placeholder="Receipent"
                    className="font-text-small"
                    onChange={(e) => {
                      setReceipent(e.target.value);
                    }}
                  />
                  <input
                    type="number"
                    name="supply"
                    min={0}
                    max={1000000000000}
                    placeholder="Supply"
                    className="font-text-small"
                    onChange={(e) => {
                      setSupply(Number(e.target.value));
                    }}
                  />
                </div>
              </div>
              <div className="extensions-row flex-column-center-start">
                <button
                  className="submit font-text-bold flex-row-center-center"
                  disabled={!supply || !receipent || !inputValid}
                  onClick={run}
                >
                  {!supply || !receipent || !inputValid
                    ? "Fill out the empty fields."
                    : "Create SPL22"}
                </button>
              </div>
            </div>
          </m.div>
        </m.div>
      </AnimatePresence>
    </>
  );
}
