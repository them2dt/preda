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
import { BackendResponse } from "@/components/backend/types";
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
}): Promise<BackendResponse> => {
  try {
    const sizeParameter = sizeChart.find(
      (element) => element.amount >= size
    ) || { depth: 3, buffer: 8, amount: 8 };
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(walletAdapterIdentity(wallet.adapter));
    const merkleTree = generateSigner(umi);
    const treeTX = await createTree(umi, {
      merkleTree,
      maxDepth: sizeParameter.depth,
      maxBufferSize: sizeParameter.buffer,
      public: visibility,
    });
    const treeTXResult = await treeTX.sendAndConfirm(umi);
    return {
      assetID: merkleTree.publicKey,
      signature: bs58.encode(treeTXResult.signature),
      status: 200,
    };
  } catch (e) {
    return { status: 500 };
  }
};

export const findMerkleTree = async ({
  connection, //
  merkleTree,
}: {
  connection: Connection; //
  merkleTree: PublicKey;
}): Promise<BackendResponse> => {
  const umi = createUmi(connection.rpcEndpoint);
  const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree);
  return { status: 200, assetID: merkleTreeAccount.publicKey };
};
export const loadAssets = async ({
  wallet,
  connection,
  address,
}: {
  wallet: Wallet;
  connection: Connection;
  address: string;
}): Promise<BackendResponse> => {
  try {
    const umi = createUmi(connection);
    umi.use(walletAdapterIdentity(wallet.adapter));
    umi.use(mplBubblegum());

    const assets = await umi.rpc.getAssetsByOwner({
      owner: publicKey(address),
    });
    console.log(assets);
    return { status: 200, dasList: assets };
  } catch (e) {
    return { status: 500 };
  }
};

export const createCNFT = async ({
  wallet,
  connection,
  merkleTree,
  title,
  sellerFeeBasisPoints,
  metadata,
  creators,
}: {
  wallet: Wallet;
  connection: Connection;
  merkleTree: PublicKey;
  title: string;
  sellerFeeBasisPoints: number;
  metadata: string;
  creators: { address: string; share: number }[];
}): Promise<BackendResponse> => {
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(walletAdapterIdentity(wallet.adapter));
    const mintTX = mintV1(umi, {
      leafOwner: umi.identity.publicKey,
      merkleTree: merkleTree,
      metadata: {
        name: title,
        uri: metadata,
        sellerFeeBasisPoints: sellerFeeBasisPoints * 100,
        collection: none(),
        creators: creators.map((item) => {
          return {
            address: publicKey(item.address),
            share: item.share,
            verified: false,
          };
        }),
      },
    });
    const mintTXResult = await mintTX.sendAndConfirm(umi);
    return { signature: bs58.encode(mintTXResult.signature), status: 200 };
  } catch (e) {
    return { status: 500 };
  }
};

export const burnCNFT = async ({
  connection, //
  wallet,
  assetId,
}: {
  connection: Connection; //
  wallet: Wallet;
  assetId: string;
}): Promise<BackendResponse> => {
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(walletAdapterIdentity(wallet.adapter));
    umi.use(dasApi());
    umi.use(mplBubblegum());

    const asset = await getAssetWithProof(umi, publicKey(assetId));
    if (asset.leafOwner == umi.identity.publicKey) {
      enqueueSnackbar("You are the owner of this asset.", {
        variant: "success",
      });

      const result = await burn(umi, {
        ...asset,
        leafOwner: umi.identity,
      })
        .sendAndConfirm(umi, { confirm: { commitment: "confirmed" } })
        .then((result) => {
          return { signature: bs58.encode(result.signature), status: 200 };
        });

      return result;
    } else {
      enqueueSnackbar("You are not the owner of this asset.", {
        variant: "error",
      });
      return { status: 400 };
    }
  } catch (e) {
    return { status: 500 };
  }
};