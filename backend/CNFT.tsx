import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi

import { none, percentAmount } from "@metaplex-foundation/umi";
import {
  mintV1,
  getAssetWithProof,
  burn,
} from "@metaplex-foundation/mpl-bubblegum";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import {
  burnV1,
  createV1,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { enqueueSnackbar } from "notistack";

/**
 * Creates a new Metaplex PNFT.
 *
 * @param {Wallet} wallet - The wallet used for the transaction.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {Object} rawData - The raw data for the NFT, which will be transformed into metadata.
 * @returns {Promise<string>} The publickey of the item.
 */
export const createCNFT = async ({
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
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  const merkleTree = generateSigner(umi).publicKey;
  const leafOwner = umi.identity.publicKey;
  try {
    const signature = await mintV1(umi, {
      leafOwner,
      merkleTree,
      metadata: {
        name: title,
        uri: metadata,
        sellerFeeBasisPoints: sellerFeeBasisPoints, // 5%
        collection: none(),
        creators: [
          { address: umi.identity.publicKey, verified: false, share: 100 },
        ],
      },
    }).sendAndConfirm(umi);
    console.log("Mint: " + merkleTree);
    console.log("Signature: " + bs58.encode(signature.signature));
    return merkleTree;
  } catch (error) {
    enqueueSnackbar("Error creating PNFT: " + error, { variant: "error" });
    return "Error creating PNFT: " + error;
  }
};

/**
 * Burns Metaplex PNFT.
 * @param {Wallet} wallet - The wallet used for the transaction.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {Object} mintAddress - The address of the NFT to be burned.
 */
export const burnCNFT = async ({
  wallet,
  connection,
  mintAdress,
}: {
  wallet: Wallet;
  connection: Connection;
  mintAdress: string;
}): Promise<string> => {
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  const mint = generateSigner(umi);
  try {
    const signature = await burnV1(umi, {
      mint: publicKey(mintAdress),
      tokenStandard: TokenStandard.ProgrammableNonFungible,
      tokenOwner: umi.identity.publicKey,
    }).sendAndConfirm(umi);
    console.log("Mint: " + mint.publicKey);
    console.log("Signature: " + bs58.encode(signature.signature));
    return mint.publicKey;
  } catch (error) {
    enqueueSnackbar("Error creating PNFT: " + error, { variant: "error" });
    return "Error creating PNFT: " + error;
  }
};
