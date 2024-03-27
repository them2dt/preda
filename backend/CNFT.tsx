import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi

import { PublicKey, none, percentAmount } from "@metaplex-foundation/umi";
import {
  mintV1,
  createTree,
  fetchMerkleTree,
} from "@metaplex-foundation/mpl-bubblegum";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { enqueueSnackbar } from "notistack";

export const createMerkleTree = async ({
  connection, //
  wallet,
}: {
  connection: Connection; //
  wallet: Wallet;
}): Promise<{ merkleTree: PublicKey; success: boolean }> => {
  enqueueSnackbar("Creating Merkle Tree...", { variant: "info" });
  console.log("createMerkleTree() - started.");
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(walletAdapterIdentity(wallet.adapter));
  const merkleTree = generateSigner(umi);
  const treeTX = await createTree(umi, {
    merkleTree,
    maxDepth: 3,
    maxBufferSize: 8,
  });
  try {
    const treeTXResult = await treeTX.sendAndConfirm(umi);
    if (treeTXResult) {
      console.log("createMerkleTree() - success!");
      console.log("Merkle tree: " + merkleTree.publicKey);
      return { merkleTree: merkleTree.publicKey, success: true };
    }
  } catch (e) {
    console.log("Error @ createMerkleTree()." + e);
    return { merkleTree: publicKey(""), success: false };
  }
  return { merkleTree: publicKey(""), success: false };
};

export const findMerkleTree = async ({
  connection, //
  wallet,
  merkleTree,
}: {
  connection: Connection; //
  wallet: Wallet;
  merkleTree: PublicKey;
}): Promise<boolean> => {
  enqueueSnackbar("Fetching Merkle Tree...", { variant: "info" });
  //
  const umi = createUmi(connection.rpcEndpoint);
  console.log("findMerkleTree() - started.");
  //
  try {
    const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree);
    if (merkleTreeAccount) {
      console.log("findMerkleTree() - Success!");
      return true;
    } else {
      console.log("findMerkleTree() - Couldnt find Merkle Tree.");
      return false;
    }
  } catch (e) {
    console.log("Error @ findMerkleTree()." + e);
    return false;
  }
  return false;
};

export const mintCNFT = async ({
  wallet,
  connection,
  merkleTree,
  title,
  sellerFeeBasisPoints,
  metadata,
}: {
  wallet: Wallet;
  connection: Connection;
  merkleTree: PublicKey;
  title: string;
  sellerFeeBasisPoints: number;
  metadata: string;
}): Promise<Boolean> => {
  enqueueSnackbar("Minting cNFT...", { variant: "info" });
  console.log("mintCNFT() - started.");
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(walletAdapterIdentity(wallet.adapter));
  const mintTX = mintV1(umi, {
    leafOwner: umi.identity.publicKey,
    merkleTree: merkleTree,
    metadata: {
      name: title,
      uri: metadata,
      sellerFeeBasisPoints: sellerFeeBasisPoints * 100, // 5%
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: false, share: 100 },
      ],
    },
  });
  try {
    const mintTXResult = await mintTX.sendAndConfirm(umi);
    if (mintTXResult.result.context.slot) {
      enqueueSnackbar("Minted cNFT!", { variant: "success" });
      console.log("mintCNFT() - Success!");
      console.log("Signature " + bs58.encode(mintTXResult.signature));
      return true;
    }
  } catch (e) {
    console.log("Error @ mintCNFT()." + e);
    return false;
  }
  return false;
};

export const createCNFT = async ({
  connection, //
  wallet,
  name,
  symbol,
  metadata,
  sellerFeeBasisPoints,
}: {
  connection: Connection; //
  wallet: Wallet;
  name: string;
  symbol: string;
  metadata: string;
  sellerFeeBasisPoints: number;
}) => {
  const mtCreation = await createMerkleTree({
    wallet: wallet,
    connection: connection,
  });
  if (mtCreation.success) {
    console.log("Waiting...");
    setTimeout(async () => {
      console.log("Waiting done.");
      const foundMerkleTree = await findMerkleTree({
        connection: connection,
        wallet: wallet,
        merkleTree: mtCreation.merkleTree,
      });
      if (foundMerkleTree) {
        console.log("Merkle Tree found.");
        const mintResult = await mintCNFT({
          wallet: wallet,
          connection: connection,
          merkleTree: mtCreation.merkleTree,
          title: name,
          sellerFeeBasisPoints: sellerFeeBasisPoints,
          metadata: metadata,
        });
      }
    },5000);
  }
};
