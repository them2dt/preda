import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi

import { none, percentAmount } from "@metaplex-foundation/umi";
import {
  mintV1,
  createTree,
  fetchMerkleTree,
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
}): Promise<any> => {
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(walletAdapterIdentity(wallet.adapter));
  const merkleTree = generateSigner(umi);

  //create "create tree" transaction
  console.log("Creating Merkle Tree...");
  const treeTX = await createTree(umi, {
    merkleTree,
    maxDepth: 3,
    maxBufferSize: 8,
  });
  //send "create tree" transaction
  const treeTXResult = await treeTX.sendAndConfirm(umi);
  console.log("Tree Signature: " + bs58.encode(treeTXResult.signature));
  //wait
  setTimeout(() => {
    console.log("Timed out.");
  }, 1000);
  // create "mint CNFT" transaction
  console.log("Minting CNFT...");
  const mintTX = mintV1(umi, {
    leafOwner: umi.identity.publicKey,
    merkleTree: merkleTree.publicKey,
    metadata: {
      name: title,
      uri: metadata,
      sellerFeeBasisPoints: sellerFeeBasisPoints*100, // 5%
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: false, share: 100 },
      ],
    },
  });
  //send "mint CNFT" transaction
  const mintTXResult = await mintTX.sendAndConfirm(umi);
  console.log("Mint Signature: " + bs58.encode(mintTXResult.signature));
  //log the signature
};
