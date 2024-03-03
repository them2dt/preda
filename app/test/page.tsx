"use client";
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

/**
 * A page to test and play with the code
 * @returns JSX.Element
 */
export default function page() {
  const wallet = useWallet();
  const { connection } = useConnection();

  // onload of the page log the wallet adress and the connection endpoint
  useEffect(() => {
    if (wallet.connected) {
      console.log("Wallet: " + wallet.publicKey?.toBase58());
    } else {
      console.log("Wallet not connected");
    }
    console.log("RPC URL: " + connection.rpcEndpoint);
  }, [wallet, connection]);
  
  // function to be tested
  const testingFunction = () => {
    console.log("Function 1 executed");
  };
  return (
    <>
      <div className="testfield flex-column-center-center">
        <div className="font-h1">Playground</div>
        <button style={{ marginTop: "20px" }}>Execute Function 1</button>
        <Navigation />
      </div>
    </>
  );
}
