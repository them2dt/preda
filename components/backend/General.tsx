//TODO: Implement the functions.

import { Wallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
//Irys
import { WebIrys } from "@irys/sdk";
import { Adapter } from "@solana/wallet-adapter-base";
import { enqueueSnackbar } from "notistack";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import {
  fetchAllDigitalAssetWithTokenByOwnerAndMint,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, unwrapOption } from "@metaplex-foundation/umi";
import { BackendResponse } from "@/types";

export const tokenStandard = [
  "NonFungible",
  "FungibleAsset",
  "Fungible",
  "NonFungibleEdition",
  "ProgrammableNonFungible",
  "ProgrammableNonFungibleEdition",
];
//function which takes a file and validates whether it is an image and fulfills the requirements (size, format, etc.)
export function validateImage(
  input: File,
  setImage: Function,
  setImagePreview: Function
): boolean {
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
  file: File | undefined;
}): Promise<BackendResponse> {
  try {
    if (wallet) {
      if (connection) {
        if (file) {
          const bundler = await getIrys({
            wallet: wallet,
            connection: connection,
          });
          const state = await bundler.ready();
          const imagePrice = await bundler.getPrice(file.size + 1048576);
          const funds = await bundler.fund(imagePrice);

          console.log(
            "Upload price: " + imagePrice.toNumber() / LAMPORTS_PER_SOL + " SOL"
          );

          const fileArrayBuffer = await file.arrayBuffer();
          const fileBuffer = Buffer.from(fileArrayBuffer);
          const imageUpload = bundler.createTransaction(fileBuffer, {
            tags: [{ name: "Content-Type", value: file.type }],
          });
          const sign = await imageUpload.sign();
          const upload = await imageUpload.upload();
          console.log(
            file.name + "." + file.type + ": https://arweave.net/" + upload.id
          );

          return { status: 200, assetID: "https://arweave.net/"+upload.id };
        } else return { status: 500 };
      } else return { status: 500 };
    } else return { status: 500 };
  } catch (e) {
    return { status: 500 };
  }
}
export async function getAsset({
  wallet,
  connection,
  assetId,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
}): Promise<BackendResponse> {
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet.adapter));
    umi.use(mplCandyMachine());

    const asset = await fetchDigitalAsset(umi, publicKey(assetId));
    return {
      status: 200,
      digitalAsset: asset,
      tokenStandard: unwrapOption(asset.metadata.tokenStandard) || 500,
      tokenBalance:{decimals:asset.mint.decimals}
    };
  } catch (e) {
    return { status: 500, errorMessage: String(e) };
  }
}
export async function getDigitalAssetBalance({
  wallet,
  connection,
  assetId,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
}): Promise<BackendResponse> {
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet.adapter));
    umi.use(mplCandyMachine());

    const asset = await fetchAllDigitalAssetWithTokenByOwnerAndMint(
      umi,
      umi.identity.publicKey,
      publicKey(assetId)
    );
    console.log("Balance:"+asset[0].token.amount)
    return {
      status: 200,
      tokenBalance: { balance: Number(asset[0].token.amount)},
    };
  } catch (e) {
    return { status: 500, errorMessage: String(e) };
  }
}