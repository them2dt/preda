import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi
import { PublicKey, none } from "@metaplex-foundation/umi";
import {
  mintV1,
  createTree,
  fetchMerkleTree,
  getAssetWithProof,
  burn,
  mplBubblegum,
} from "@metaplex-foundation/mpl-bubblegum";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { enqueueSnackbar } from "notistack";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
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
  size,
  visibility,
}: {
  connection: Connection; //
  wallet: Wallet;
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
    public: visibility,
  });
  try {
    console.log("Merkle tree: " + merkleTree.publicKey);
    console.log("Public key: " + wallet.adapter.publicKey.toBase58());
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

export const burnCNFT = async ({
  connection, //
  wallet,
  assetId,
}: {
  connection: Connection; //
  wallet: Wallet;
  assetId: string;
}): Promise<boolean> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(walletAdapterIdentity(wallet.adapter));
  umi.use(dasApi());
  umi.use(mplBubblegum());

  try {
    const asset = await getAssetWithProof(umi, publicKey(assetId));
    if (asset.leafOwner == umi.identity.publicKey) {
      enqueueSnackbar("You are the owner of this asset.", {
        variant: "success",
      });

      await burn(umi, {
        ...asset,
        leafOwner: umi.identity,
      })
        .sendAndConfirm(umi, { confirm: { commitment: "confirmed" } })
        .then((result) => {
          if (result.signature) {
            return true;
          }
        });
      return true;
    } else {
      enqueueSnackbar("You are not the owner of this asset.", {
        variant: "error",
      });
      return false;
    }
  } catch (e) {
    console.log("BurnCNFT(): " + e);
    return false;
  }
};
