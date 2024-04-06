//TODO: Implement the functions.

import { Wallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
//Irys
import { WebIrys } from "@irys/sdk";
import { Adapter } from "@solana/wallet-adapter-base";
import { enqueueSnackbar } from "notistack";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import {
  fetchAllDigitalAssetWithTokenByOwner,
  fetchAllDigitalAssetWithTokenByOwnerAndMint,
  fetchDigitalAsset,
  fetchDigitalAssetByMetadata,
  fetchDigitalAssetWithToken,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { metadata } from "@/app/layout";
import { publicKey, unwrapOption } from "@metaplex-foundation/umi";

export const tokenStandard = [
  "NonFungible",
  "FungibleAsset",
  "Fungible",
  "NonFungibleEdition",
  "ProgrammableNonFungible",
  "ProgrammableNonFungibleEdition",
];
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

async function getIrys({
  wallet,
  connection,
}: {
  wallet: Wallet;
  connection: Connection;
}) {
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
}
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
}

export async function getAsset({
  wallet,
  connection,
  assetId,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
}): Promise<{
  name: string;
  tokenStandard: number;
  mutable: boolean;
  decimals: number;
}> {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  umi.use(mplCandyMachine());

  try {
    const asset = await fetchDigitalAsset(umi, publicKey(assetId));
    console.log("Mint: " + asset.publicKey);
    console.log("Mint: " + asset.publicKey);
    console.log("Name: " + asset.metadata.name);
    console.log(
      "Token standard: " +
        tokenStandard[unwrapOption(asset.metadata.tokenStandard)]
    );
    console.log("Mutable: " + asset.metadata.isMutable);
    return {
      name: asset.metadata.name,
      tokenStandard: unwrapOption(asset.metadata.tokenStandard),
      mutable: asset.metadata.isMutable,
      decimals: asset.mint.decimals,
    };
  } catch (e) {
    console.log("Error @ getAsset(): " + e);
    return {
      name: "",
      tokenStandard: 500,
      mutable: false,
      decimals: 500,
    };
  }
}

export async function getHoldingFromOwner({
  wallet,
  connection,
  assetId,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
}): Promise<number> {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  umi.use(mplCandyMachine());

  try {
    const asset = await fetchAllDigitalAssetWithTokenByOwnerAndMint(
      umi,
      umi.identity.publicKey,
      publicKey(assetId)
    );
    console.log("Amount: " + asset[0].token.amount.toString());
    return Number(asset[0].token.amount);
  } catch (e) {
    console.log("Error @ getAsset(): " + e);
  }
}
