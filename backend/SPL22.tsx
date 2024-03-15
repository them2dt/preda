import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi

import { keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";


import {
  burnV1,
  createV1,
  mintV1,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { enqueueSnackbar } from "notistack";

/**
 * Converts raw data into a JSON string for the metadata parameter.
 * @param {Object} rawData - The raw data for the NFT.
 * @returns {string} The JSON string of the metadata.
 */
const stringifyMetadata = (rawData: Object): string => {
  return JSON.stringify(rawData);
};


/**
 * Creates a new Token22 (fungible token).
 *
 * @param {Wallet} wallet - The wallet used for the transaction.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {string} name - The name of the token.
 * @param {string} symbol - The symbol of the token.
 * @param {number} decimals - The number of decimals for the token.
 * @param {string} uri - The URI for the token metadata.
 * @param {Object} rawData - The raw data for the token metadata.
 * @returns {Promise<string>} The publickey of the token mint.
 */
export const createToken22 = async ({
    wallet,
    connection,
    name,
    symbol,
    decimals,
    uri,
    rawData,
  }: {
    wallet: Wallet;
    connection: Connection;
    name: string;
    symbol: string;
    decimals: number;
    uri: string;
    rawData: any;
  }): Promise<string> =>{
    enqueueSnackbar("initialize umi", { variant: "info" });
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet.adapter));
    const mint = generateSigner(umi);

    // Convert raw data into a JSON string
    const metadataJsonString = stringifyMetadata(rawData);


    try {
      const result = await createV1(umi, {
        mint,
        name,
        symbol,
        decimals,
        uri: metadataJsonString,
        sellerFeeBasisPoints: percentAmount(0), // Add sellerFeeBasisPoints with a value of 0
      }).sendAndConfirm(umi);
  
      console.log("Mint: " + mint.publicKey);
      console.log("Signature: " + bs58.encode(result.signature));
      if (result.signature) {
        enqueueSnackbar("Token created", { variant: "success" });
      }
      return mint.publicKey;
    } catch (error) {
      enqueueSnackbar("Error creating Token: " + error, { variant: "error" });
      console.log(error);
      return "Error creating Token: " + error;
    }
  }
/**
 * Burns a Token22 (fungible token).
 * @param {Wallet} wallet - The wallet used for the transaction.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {string} tokenMintAddress - The address of the token mint to be burned.
 * @param {number} amount - The amount of the token to be burned.
 */
export const burnToken22 = async ({
    wallet,
    connection,
    tokenMintAddress,
    amount,
  }: {
    wallet: Wallet;
    connection: Connection;
    tokenMintAddress: string;
    amount: number;
  }): Promise<string> => {
    enqueueSnackbar("initialize umi", { variant: "info" });
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet.adapter));
    try {
      const result = await burnV1(umi, {
        mint: publicKey(tokenMintAddress),
        tokenStandard: TokenStandard.Fungible,
        amount,
        tokenOwner: umi.identity.publicKey,
      }).sendAndConfirm(umi);
      console.log("Mint: " + umi.identity.publicKey);
      console.log("Signature: " + bs58.encode(result.signature));
      return bs58.encode(result.signature);
    } catch (error) {
      enqueueSnackbar("Error burning Token22: " + error, { variant: "error" });
      return "Error burning Token22: " + error;
    }
  };
