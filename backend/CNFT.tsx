import { Wallet } from "@solana/wallet-adapter-react";
import { Connection, Transaction } from "@solana/web3.js";
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
const sizeChart = [
  { depth: 3, buffer: 8, amount: 8 },
  { depth: 5, buffer: 8, amount: 32 },
  { depth: 14, buffer: 64, amount: 16384 },
  { depth: 15, buffer: 64, amount: 32768 },
  { depth: 16, buffer: 64, amount: 65536 },
  { depth: 17, buffer: 64, amount: 131072 },
  { depth: 18, buffer: 64, amount: 262144 },
  { depth: 19, buffer: 64, amount: 524288 },
  { depth: 20, buffer: 64, amount: 1048576 },
  { depth: 24, buffer: 64, amount: 16777216 },
  { depth: 26, buffer: 512, amount: 67108864 },
  { depth: 30, buffer: 512, amount: 1073741824 },
];
export const createMerkleTree = async ({
  connection, //
  wallet,
  leafOwner,
  size,
  visibility,
}: {
  connection: Connection; //
  wallet: Wallet;
  leafOwner: string;
  size: number;
  visibility: boolean;
}): Promise<{ merkleTree: PublicKey; success: boolean }> => {
  //compare the sizeParameter with the amount value of the sizeChart array and choose which value is the next highest value to the size
  const sizeParameter = sizeChart.find((element) => element.amount >= size);
  console.log(sizeParameter.amount);
  console.log("createMerkleTree() - started.");
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(walletAdapterIdentity(wallet.adapter));
  const merkleTree = generateSigner(umi);
  const treeTX = await createTree(umi, {
    merkleTree,
    maxDepth: sizeParameter.depth,
    maxBufferSize: sizeParameter.buffer,
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
