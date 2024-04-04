//TODO: Implement the functions.

import { Wallet } from "@solana/wallet-adapter-react";

//solana
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity as umiWalletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
//Irys
import { WebIrys } from "@irys/sdk";
import { Adapter } from "@solana/wallet-adapter-base";
import { enqueueSnackbar } from "notistack";
import { publicKey } from "@metaplex-foundation/umi";
import {
  DasApiAssetAuthority,
  DasApiAssetCreator,
  DasApiAssetList,
  dasApi,
} from "@metaplex-foundation/digital-asset-standard-api";

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

export async function loadNFTs({
  wallet,
  endpoint,
  limit,
  page,
}: {
  wallet: Wallet;
  endpoint: string;
  limit: number;
  page: number;
}): Promise<
  {
    mint: string;
    name: string;
    description: string;
    imageUri: string;
    attributes: { trait_type: string; value: string }[];
    authorities: DasApiAssetAuthority[];
    compressed: boolean;
    creators: DasApiAssetCreator[];
    royalty: number;
    tokenStandard: string;
    type: string;
  }[]
> {
  const umi = createUmi(endpoint);
  umi.use(mplTokenMetadata());
  umi.use(umiWalletAdapterIdentity(wallet.adapter));
  umi.use(dasApi());

  const rpcAssets: DasApiAssetList = await umi.rpc.getAssetsByOwner({
    owner: publicKey(wallet.adapter.publicKey.toBase58()),
    limit: limit || 50,
    page: page || 1,
  });
  if (rpcAssets) {
    console.log(rpcAssets);
    const formattedItems: {
      mint: string;
      name: string;
      description: string;
      imageUri: string;
      attributes: { trait_type: string; value: string }[];
      authorities: DasApiAssetAuthority[];
      compressed: boolean;
      creators: DasApiAssetCreator[];
      royalty: number;
      tokenStandard: string;
      type: string;
    }[] = [];
    for (let i = 0; i < rpcAssets.items.length; i++) {
      try {
        const formattedItem = {
          mint: rpcAssets.items[i].id,
          name: rpcAssets.items[i].content.metadata.name,
          description: rpcAssets.items[i].content.metadata.description || "-",
          imageUri: rpcAssets.items[i].content.links["image"] || "",
          attributes: rpcAssets.items[i].content.metadata.attributes.map(
            (attribute) => ({
              trait_type: attribute.trait_type || "",
              value: attribute.value || "",
            })
          ),
          authorities: rpcAssets.items[i].authorities,
          compressed: rpcAssets.items[i].compression.compressed,
          creators: rpcAssets.items[i].creators,
          royalty: rpcAssets.items[i].royalty.basis_points,
          tokenStandard: rpcAssets.items[i].content.metadata.token_standard,
          type: rpcAssets.items[i].interface,
        };

        formattedItems.push(formattedItem);
      } catch (error) {
        console.error("Error formatting item:", error);
      }
    }
    return formattedItems;
  }
  return [];
}

/*
export async function loadNFTs({
  wallet,
  endpoint,
}: {
  wallet: Wallet;
  endpoint: string;
}): Promise<
  {
    name: string;
    description: string;
    mint: string;
    imageUri: string;
    updateAuthority: string;
    attributes: { trait_type: string; value: string }[];
    tokenStandard: number;
  }[]
> {
  enqueueSnackbar("Loading NFTs...", { variant: "info" });
  const ts = ["NFT", "PNFT", "CNFT"];
  const connection = new Connection(endpoint, "confirmed");
  const metaplex = new Metaplex(connection);
  const walletAdapter: WalletAdapter = {
    publicKey: wallet.adapter.publicKey,
  };
  metaplex.use(walletAdapterIdentity(walletAdapter));
  const nfts = await metaplex
    .nfts()
    .findAllByOwner({ owner: walletAdapter.publicKey || PublicKey.default });
  const array = [];

  for (let i = 0; i < nfts.length; i++) {
    const response = await axios.get(nfts[i].uri);
    const data = response.data;
    console.log(data);
    console.log("--------------------");
    console.log(nfts[i]);
    const formattedItem = {
      name: nfts[i].name,
      description: data.description || "-",
      mint: nfts[i].address.toBase58(),
      imageUri: data.image || "",
      updateAuthority: nfts[i].updateAuthorityAddress.toBase58(),
      attributes: data.attributes,
      tokenStandard: nfts[i].tokenStandard,
    };
    array.push(formattedItem);
    console.log("NFT " + i.toString() + " - " + formattedItem.mint);
  }
  return array;
}
*/

/* export const loadAssets = async ({
  wallet,
  connection,
}: {
  wallet: Wallet;
  connection: Connection;
}): Promise<string> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(umiWalletAdapterIdentity(wallet.adapter));
  try {
  } catch (error) {
    enqueueSnackbar("Error loading assets: " + error, { variant: "error" });
  }

  return "";
} 
*/
