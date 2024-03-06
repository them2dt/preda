"use client";
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { validateImage, uploadFileToIrys } from "../../backend/General";
/**
 * A page to test and play with the code
 * @returns JSX.Element
 */
export default function page() {
  const [image, setImage] = useState<File>();
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
  const testingFunction = async () => {
    console.log("Function 1 executed");
    console.log("Image name: " + (image?.name || "No image selected"));
    if (image) {
      if (wallet.wallet) {
        await uploadFileToIrys(wallet.wallet, connection, image);
      } else {
        console.log("Wallet is null");
      }
    } else {
      console.log("No image selected");
    }
  };
  return (
    <>
      <div className="testfield flex-column-center-center">
        <div className="font-h1">Playground</div>
        <input
          type="file"
          name="cover"
          accept="image/png"
          onChange={(e) => {
            if (e.target.files) {
              validateImage(
                e.target.files[0], // Cast e.target.files[0] to File type
                () => {},
                () => {}
              );
              setImage(e.target.files[0]);

              console.log(e.target.files[0].name);
            }
          }}
        />
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
