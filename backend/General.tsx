//TODO: Implement the functions.

import { Wallet } from "@solana/wallet-adapter-react";

//solana
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
//Irys
import { WebIrys } from "@irys/sdk";
import { Adapter, StandardWalletAdapter } from "@solana/wallet-adapter-base";
import { enqueueSnackbar } from "notistack";
// umi
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

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

const getIrys = async ({
  wallet,
  connection,
}: {
  wallet: Wallet;
  connection: Connection;
}) => {
  const providerUrl = connection.rpcEndpoint;
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
export async function uploadFileToIrys({
  wallet,
  connection,
  file,
}: {
  wallet: Wallet;
  connection: Connection;
  file: File;
}): Promise<string> {
  const bundler = await getIrys({ wallet: wallet, connection: connection });
  const state = await bundler.ready();
  const imagePrice = await bundler.getPrice(file.size + 1048576);
  const funds = await bundler.fund(imagePrice);

  console.log(
    "Image price: " + imagePrice.toNumber() / LAMPORTS_PER_SOL + " SOL"
  );

  const fileArrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(fileArrayBuffer);
  const imageUpload = bundler.createTransaction(fileBuffer, {
    tags: [{ name: "Content-Type", value: file.type }],
  });
  const sign = await imageUpload.sign();
  const upload = await imageUpload.upload();
  console.log(
    "Uploaded " +
      file.name +
      "." +
      file.type +
      ": https://arweave.net/" +
      upload.id
  );

  return "https://arweave.net/" + upload.id;
} //function which takes a file and uploads it to the arweave network using the irys-sdk

async function getAsset(url: string, pubkeys: string[]) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAssetBatch",
      params: {
        ids: pubkeys,
      },
    }),
  });
  const { result } = await response.json();
  console.log("Assets: ", result);
}

// TODO: Replace current functionality with metaplex/js module (https://solanacookbook.com/references/nfts.html#how-to-get-nft-metadata)
export async function loadNFTs({
  wallet,
  endpoint,
}: {
  wallet: string;
  endpoint: string; 
}): Promise<
  {
    name: string;
    mint: string;
    imageUri: string;
    updateAuthority: string;
    attributes: { trait_type: string; value: string }[];
    tokenStandard: string;
  }[]
> {
  console.log("Loading NFTs...");
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
  };

  const response = await fetch(
    "https://api-devnet.magiceden.dev/v2/wallets/" + wallet + "/tokens",
    options
  );
  const data = await response.json();
  const arrayResponse = Array.isArray(data) ? data : [];
  const resultArray: {
    name: string;
    mint: string;
    imageUri: string;
    updateAuthority: string;
    attributes: { trait_type: string; value: string }[];
    tokenStandard: string;
  }[] = [];
  for (let i = 0; i < arrayResponse.length; i++) {
    const item = {
      name: arrayResponse[i].name,
      mint: arrayResponse[i].mintAddress,
      imageUri: arrayResponse[i].image,
      updateAuthority: arrayResponse[i].updateAuthority,
      attributes: arrayResponse[i].attributes,
      tokenStandard: arrayResponse[i].tokenStandard || 0,
    };
    resultArray.push(item);
  }
  console.log(resultArray);
  return resultArray;
}
