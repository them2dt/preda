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
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";


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

type TokenMetadata = {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: {
    address: string;
    verified: boolean;
    share: number;
  }[];
  collection: {
    verified: boolean;
    name: string;
  } | null;
  uses: number;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: number;
  tokenStandard: string;
};

/**
 * Loads NFTs for a given wallet address.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {PublicKey} walletAddress - The address of the wallet to load NFTs for.
 * @returns {Promise<TokenMetadata[]>} The NFT metadata for the wallet.
 */
export const loadNFTs = async (
  connection: Connection,
  walletAddress: PublicKey
): Promise<TokenMetadata[]> => {
  enqueueSnackbar("Loading NFTs...", { variant: "info" });

  try {
    const associatedTokenAddresses = await getAssociatedTokens(connection, walletAddress);
    const nftMetadatas: TokenMetadata[] = [];

    for (const associatedTokenAddress of associatedTokenAddresses) {
      const nftMetadataAddress = await getMetadataAddress(associatedTokenAddress);
      const nftMetadata = await connection.getAccountInfo(nftMetadataAddress);
      if (!nftMetadata) {
        continue;
      }

      const metadata = JSON.parse(nftMetadata.data.toString()) as any;
      if (metadata.tokenStandard !== "NonFungible") {
        continue;
      }

      const nftMint = metadata.mint;
      const nftName = metadata.name;
      const nftImageUri = metadata.uri;
      const nftUpdateAuthority = metadata.updateAuthority;
      const nftAttributes = metadata.attributes;
      const nftTokenStandard = metadata.tokenStandard;

      const nft: TokenMetadata = {
        name: nftName,
        symbol: metadata.symbol,
        uri: nftImageUri,
        sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
        creators: metadata.creators,
        collection: metadata.collection,
        uses: metadata.uses,
        primarySaleHappened: metadata.primarySaleHappened,
        isMutable: metadata.isMutable,
        editionNonce: metadata.editionNonce,
        tokenStandard: nftTokenStandard,
      };
      nftMetadatas.push(nft);
    }

    enqueueSnackbar("Loaded NFTs", { variant: "success" });
    return nftMetadatas;
  } catch (error) {
    enqueueSnackbar("Error loading NFTs: " + error, { variant: "error" });
    console.log(error);
    return [];
  }
};

/**
 * Gets the associated token addresses for a given wallet address.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {PublicKey} walletAddress - The address of the wallet to get associated token addresses for.
 * @returns {Promise<PublicKey[]>} The associated token addresses for the wallet.
 */
async function getAssociatedTokens(
  connection: Connection,
  walletAddress: PublicKey
): Promise<PublicKey[]> {
  const associatedTokenAddressPromises = [];
  const tokenProgramId = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5d5aW7L8f");
  const tokenAccounts = await connection.getParsedProgramAccounts(tokenProgramId);
  for (const tokenAccount of tokenAccounts) {
    if (tokenAccount.account && "data" in tokenAccount.account && Buffer.isBuffer(tokenAccount.account.data)) {
      const associatedTokenAddress = getAssociatedTokenAddress(tokenAccount.pubkey!, walletAddress, tokenProgramId);
      associatedTokenAddressPromises.push(associatedTokenAddress);
    }
  }
  return Promise.all(associatedTokenAddressPromises);
}