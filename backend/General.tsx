//TODO: Implement the functions.

import { Wallet } from "@solana/wallet-adapter-react";

//solana
import { Connection } from "@solana/web3.js";
//Irys
import { WebIrys } from "@irys/sdk";
import { Adapter, StandardWalletAdapter } from "@solana/wallet-adapter-base";
import { enqueueSnackbar } from "notistack";

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
            enqueueSnackbar("Image is valid", { variant: "success" });
            setImagePreview([reader.result]);
            return true; // Return the image if it meets the criteria
          } else {
            console.log("not square");
            enqueueSnackbar("Image has to be square format.", {
              variant: "warning",
            });
            return false; // Return undefined if image is not square
          }
        };
      };
      reader.readAsDataURL(input); // Read the image file
    } else {
      enqueueSnackbar("Image has to be a png.", { variant: "warning" });

      return false; // Return undefined if input type is not PNG
    }
  } else {
    console.log("no input");
    return false; // Return undefined if input is not defined
  }
  return false;
}

const getIrys = async (wallet: Wallet) => {
  const providerUrl =
    "https://devnet.helius-rpc.com/?api-key=5d69c879-36f4-4acf-87b4-e44a64c07acc";

  const useProvider = wallet?.adapter as Adapter;
  await useProvider.connect();

  const irys = new WebIrys({
    url: "https://devnet.irys.xyz", // URL of the node you want to connect to
    token: "solana", // Token used for payment
    wallet: {
      provider: useProvider,
    },
    config: { providerUrl }, // Optional provider URL, only required when using Devnet
  });
  return irys;
};
//function which takes a file and uploads it to the arweave network using the irys-sdk
export async function uploadFileToIrys(
  wallet: Wallet,
  connection: Connection,
  file: File
): Promise<string> {
  const bundler = await getIrys(wallet);
  const state = await bundler.ready();
  console.log("Irys state: " + state.address);
  const imagePrice = await bundler.getPrice(file.size + 1048576);
  const funds = await bundler.fund(imagePrice);

  console.log("Image price: " + imagePrice);
  console.log("Funds: " + funds.id);

  const fileArrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(fileArrayBuffer);
  console.log("creating transaction...");
  const imageUpload = bundler.createTransaction(fileBuffer, {
    tags: [{ name: "Content-Type", value: file.type }],
  });
  console.log("creating transaction...");
  const sign = await imageUpload.sign();
  console.log("executing transaction...");
  const upload = await imageUpload.upload();
  console.log("FINAL: https://arweave.net/$" + upload.id);

  return "https://arweave.net/" + upload.id;
}
//function which takes required arguments like name, description, file and metadata and returns a metadata object
export async function generateMetadata({}: any): Promise<any> {}
