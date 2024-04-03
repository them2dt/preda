"use client";
import React from "react";
import Navigation from "@/components/Navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createAndMintSPL22, findSPL22, mintSPL22 } from "@/backend/SPL22";
import { publicKey } from "@metaplex-foundation/umi";
/**
 * A page to test and play with the code
 * @returns JSX.Element
 */
export default function Home() {
  const { wallet } = useWallet();
  const { connection } = useConnection();

  const testingFunction = async () => {
    await createAndMintSPL22({
      wallet: wallet,
      connection: connection,
    });
  };
  return (
    <>
      <div className="testfield flex-column-center-center">
        <div className="font-h1">Playground</div>
        <button
          style={{ marginTop: "20px" }}
          onClick={() => {
            testingFunction();
          }}
        >
          Execute Function 1
        </button>
        <Navigation />
      </div>
    </>
  );
}
