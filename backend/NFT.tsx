import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi

import { percentAmount } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import {
  burnV1,
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

/**
 * Creates a new Metaplex Standard NFT (Non-Fungible Token).
 *
 * @param {Wallet} wallet - The wallet used for the transaction.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {Object} rawData - The raw data for the NFT, which will be transformed into metadata.
 * @returns {Promise<string>} The publickey of the item.
 */
export const createNFT = async ({
  wallet,
  connection,
  title,
  sellerFeeBasisPoints,
  metadata,
}: {
  wallet: Wallet;
  connection: Connection;
  title: string;
  sellerFeeBasisPoints: number;
  metadata: string;
}): Promise<string> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  const mint = generateSigner(umi);
  try {
    const result = await createNft(umi, {
      mint,
      name: title,
      uri: metadata,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
    }).sendAndConfirm(umi);

    console.log("Mint: " + mint.publicKey);
    console.log("Signature: " + bs58.encode(result.signature));
    if (result.signature) {
    }
    return mint.publicKey;
  } catch (error) {
    console.log(error);
    return "Error creating NFT: " + error;
  }
};

//TODO: Validate if the burnNFT function works
/**
 * Burns Metaplex Standard NFT (Non-Fungible Token).
 * @param {Wallet} wallet - The wallet used for the transaction.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {Object} mintAddress - The address of the NFT to be burned.
 */
export const burnNFT = async ({
  wallet,
  connection,
  mintAdress,
}: {
  wallet: Wallet;
  connection: Connection;
  mintAdress: string;
}): Promise<string> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  const mint = generateSigner(umi);
  try {
    const signature = await burnV1(umi, {
      mint: publicKey(mintAdress),
      tokenStandard: TokenStandard.NonFungible,
      tokenOwner: umi.identity.publicKey,
    }).sendAndConfirm(umi);
    console.log("Mint: " + mint.publicKey);
    console.log("Signature: " + bs58.encode(signature.signature));
    return mint.publicKey;
  } catch (error) {
    return "Error creating NFT: " + error;
  }
};
