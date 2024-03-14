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
 * Creates a new Token22 (fungible token).
 *
 * @param {Wallet} wallet - The wallet used for the transaction.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {string} name - The name of the token.
 * @param {string} symbol - The symbol of the token.
 * @param {number} decimals - The number of decimals for the token.
 * @param {string} uri - The URI for the token metadata.
 * @returns {Promise<string>} The publickey of the token mint.
 */
export const createSPL22 = async ({
  wallet,
  connection,
  name,
  symbol,
  decimals,
  uri,
}: {
  wallet: Wallet;
  connection: Connection;
  name: string;
  symbol: string;
  decimals: number;
  uri: string;
}): Promise<string> => {
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  const mint = generateSigner(umi);
  try {
    const result = await createV1(umi, {
      mint,
      name,
      symbol,
      decimals,
      uri,
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
};
//update the SPL-22 token
export async function updateSPL22({}: any): Promise<any> {}
//mint the SPL-22 token
export async function mintSPL22({}: any): Promise<any> {}
//burn the SPL-22 token
export async function burnSPL22({}: any): Promise<any> {}
