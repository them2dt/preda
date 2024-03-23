import { Wallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { createInitializeMintInstruction, createMint } from "@solana/spl-token";
import { keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const SPL_TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

import {
  burnV1,
  createV1,
  mintV1,
  mplTokenMetadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { enqueueSnackbar } from "notistack";

/**
 * Converts raw data into a JSON string for the metadata parameter.
 * @param {Object} rawData - The raw data for the NFT.
 * @returns {string} The JSON string of the metadata.
 */
//const stringifyMetadata = (rawData: Object): string => {
  //return JSON.stringify(rawData);
//};

/**
 * Creates a new SPL-22 token.
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
    metadata,
    sellerFeeBasisPoints,
  }: {
    wallet: Wallet;
    connection: Connection;
    name: string;
    symbol: string;
    decimals: number;
    metadata: string;
    sellerFeeBasisPoints: number;
  }): Promise<string> =>{
    enqueueSnackbar("initialize umi", { variant: "info" });
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet.adapter));
    if (wallet.adapter.publicKey) {
      const mintKeypair = Keypair.fromSecretKey(bs58.decode(wallet.adapter.publicKey.toBase58()));
      const mint = await createMint(
        connection,
        mintKeypair,
        mintKeypair.publicKey,
        decimals,
        undefined,
        SPL_TOKEN_2022_PROGRAM_ID
      );}

      // Initialize the SPL-22 token account
      const initializeMintInstruction = createInitializeMintInstruction(
        mint,
        decimals,
        mintKeypair.publicKey,
        undefined,
        undefined,
        SPL_TOKEN_2022_PROGRAM_ID
      );
      await connection.sendAndConfirmTransaction(
        new Transaction().add(initializeMintInstruction),
        [mintKeypair]
      );


    // Create the token metadata account
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