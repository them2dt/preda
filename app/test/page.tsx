"use client";
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { validateImage, uploadFileToIrys } from "../../backend/General";
/**
 * A page to test and play with the code
 * @returns JSX.Element
 */
export default function Home() {
  const [image, setImage] = useState<File>();
  const { wallet } = useWallet();
  const { connection } = useConnection();

  const testingFunction = async () => {};
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
