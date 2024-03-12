import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi

import { none, percentAmount } from "@metaplex-foundation/umi";
import { mintV1, createTree } from "@metaplex-foundation/mpl-bubblegum";
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
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(walletAdapterIdentity(wallet.adapter));
  //
  const merkleTree = generateSigner(umi);
  const tx_1 = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
  });
  //
  const tx_2 = mintV1(umi, {
    leafOwner: umi.identity.publicKey,
    merkleTree: merkleTree.publicKey,
    metadata: {
      name: title,
      uri: metadata,
      sellerFeeBasisPoints: sellerFeeBasisPoints, // 5%
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: false, share: 100 },
      ],
    },
  });
  //
  try {
    const signature_1 = await tx_1.sendAndConfirm(umi);
    if (signature_1.signature) {
      const signature_2 = await tx_2.sendAndConfirm(umi);
      console.log("Mint: " + merkleTree.publicKey);
      console.log("Signature 2: " + signature_2.signature);
    }
  } catch (error) {
    console.log("Error: " + error);
  }
  return merkleTree.publicKey;
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
    console.log("Error burning PNFT: " + error);
    enqueueSnackbar("Error creating PNFT: " + error, { variant: "error" });

    return "Error creating PNFT: " + error;
  }
};
