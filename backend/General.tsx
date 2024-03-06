//TODO: Implement the functions.

import {
  WalletContextState,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

//solana
import { Connection } from "@solana/web3.js";
//metaplex
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { createGenericFile } from "@metaplex-foundation/umi";

//NOTIZ: DAS FUNKTIONIERT - LUEG BI /TEST
//function which takes a file and validates whether it is an image and fulfills the requirements (size, format, etc.)
export async function validateImage(
  input: File,
  setImage: Function,
  setImagePreview: Function
): Promise<boolean> {
  if (input != undefined) {
    // Check if input is defined
    if (input.type == "image/png") {
      // Check if input type is PNG
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.src = e.target?.result?.toString() || "";
        img.onload = function () {
          if (img.width == img.height) {
            // Check if image is square
            setImage(input); // Set the image if it meets the criteria
            console.log("match!");
            setImagePreview([reader.result]);
            return true; // Return the image if it meets the criteria
          } else {
            console.log("not square");
            return false; // Return undefined if image is not square
          }
        };
      };
      reader.readAsDataURL(input); // Read the image file
    } else {
      console.log("not a png");
      return false; // Return undefined if input type is not PNG
    }
  } else {
    console.log("no input");
    return false; // Return undefined if input is not defined
  }
  return false;
}

//function which takes a file and uploads it to the arweave network using the irys-sdk
export async function uploadFileToIrys(
  wallet: WalletContextState,
  connection: Connection,
  file: File
): Promise<any> {
  const fileBuffer = await file.arrayBuffer();
  const fileArray = new Uint8Array(fileBuffer); // Convert ArrayBuffer to Uint8Array
  const genericFile = createGenericFile(fileArray, "test.txt", {
    contentType: "text/txt",
  });

  const umi = createUmi(connection); //create umi
  irysUploader().install(umi);
  umi.use(irysUploader()); //install irys-uploader-plugin
  umi.use(walletAdapterIdentity(wallet)); //install wallet-adapter-identity
  const [uri] = await umi.uploader.upload([genericFile]); //upload file to irys and get the uri
  console.log(uri);
}
//function which takes required arguments like name, description, file and metadata and returns a metadata object
export async function generateMetadata({}: any): Promise<any> {}
