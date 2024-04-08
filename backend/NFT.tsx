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
  creators,
}: {
  wallet: Wallet;
  connection: Connection;
  title: string;
  sellerFeeBasisPoints: number;
  metadata: string;
  creators: { address: string; share: number }[];
}): Promise<string> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  const mint = generateSigner(umi);
  try {
    console.log({
      mint,
      name: title,
      uri: metadata,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
      creators: creators.map((item) => {
        return {
          address: publicKey(item.address),
          share: item.share,
          verified: false,
        };
      }),
    });
    const result = await createNft(umi, {
      mint,
      name: title,
      uri: metadata,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
      creators: creators.map((item) => {
        return {
          address: publicKey(item.address),
          share: item.share,
          verified: false,
        };
      }),
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

export const burnNFT = async ({
  wallet,
  connection,
  assetId,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
}): Promise<boolean> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  try {
    await burnV1(umi, {
      mint: publicKey(assetId),
      tokenStandard: TokenStandard.NonFungible,
      tokenOwner: umi.identity.publicKey,
    })
      .sendAndConfirm(umi, { confirm: { commitment: "confirmed" } })
      .then((result) => {
        if (result.signature) {
          return true;
        } else {
          return false;
        }
      });
  } catch (e) {
    console.log("BurnNFT(): " + e);
    return false;
  }
};
