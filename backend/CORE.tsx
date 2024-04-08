import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
//umi
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  publicKey,
  generateSigner,
  TransactionBuilder,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplCore,
  createV1,
  fetchAssetV1,
  AssetV1,
  burnV1,
  createCollectionV1,
  updateV1,
  collectionAddress,
} from "@metaplex-foundation/mpl-core";
import base58 from "bs58";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { BackendResponse } from "@/types";

export const createCoreAsset = async ({
  wallet,
  connection,
  name,
  metadata,
  collection,
}: {
  wallet: Wallet;
  connection: Connection;
  name: string;
  metadata: string;
  collection?: string;
}): Promise<BackendResponse> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(mplCore());
  umi.use(walletAdapterIdentity(wallet.adapter));

  const assetId = generateSigner(umi);
  if (collection) {
    const transaction = createV1(umi, {
      asset: assetId,
      name: name,
      uri: metadata,
      collection: publicKey(collection),
    });

    try {
      console.log("sending...");
      const result = await transaction.sendAndConfirm(umi);
      console.log("Signature: " + base58.encode(result.signature));
      if (result) {
        console.log("success: " + assetId.publicKey);
        return {
          assetID: assetId.publicKey,
          signature: base58.encode(result.signature),
        };
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    const transaction = createV1(umi, {
      asset: assetId,
      name: name,
      uri: metadata,
    });

    try {
      console.log("sending...");
      const result = await transaction.sendAndConfirm(umi);
      console.log("Signature: " + base58.encode(result.signature));
      if (result) {
        console.log("success: " + assetId.publicKey);
        return {
          assetID: assetId.publicKey,
          signature: base58.encode(result.signature),
        };
      }
    } catch (e) {
      console.log(e);
    }
  }
};
export const updateCoreAsset = async ({
  wallet,
  connection,
  assetId,
  name,
  metadata,
  collection,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
  name: string;
  metadata: string;
  collection?: string;
}): Promise<BackendResponse> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(mplCore());
  umi.use(walletAdapterIdentity(wallet.adapter));
  if (collection) {
    console.log("Updating with collection.")
    const transaction = updateV1(umi, {
      asset: publicKey(assetId),
      newName: name,
      newUri: metadata,
      collection: publicKey(collection),
    });
    try {
      console.log("sending...");
      const result = await transaction.sendAndConfirm(umi);
      console.log("Signature: " + base58.encode(result.signature));
      if (result) {
        console.log("success: " + assetId);
        return {
          assetID: assetId,
          signature: base58.encode(result.signature),
        };
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log("Updating without collection.")
    const transaction = updateV1(umi, {
      asset: publicKey(assetId),
      newName: name,
      newUri: metadata,
    });
    try {
      console.log("sending...");
      const result = await transaction.sendAndConfirm(umi);
      console.log("Signature: " + base58.encode(result.signature));
      if (result) {
        console.log("success: " + assetId);
        return {
          assetID: assetId,
          signature: base58.encode(result.signature),
        };
      }
    } catch (e) {
      console.log(e);
    }
  }
};
export const fetchAsset = async ({
  wallet,
  connection,
  assetId,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
}): Promise<BackendResponse> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(mplCore());
  umi.use(walletAdapterIdentity(wallet.adapter));

  const asset = await fetchAssetV1(umi, publicKey(assetId));
  return { assetID: asset.publicKey, coreAsset: asset };
};
export const burnAsset = async ({
  wallet,
  connection,
  assetId,
  collection,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
  collection?: string;
}): Promise<BackendResponse> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(mplCore());
  umi.use(walletAdapterIdentity(wallet.adapter));

  if (/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(collection)) {
    const response = await burnV1(umi, {
      asset: publicKey(assetId),
      collection: publicKey(collection),
    })
      .sendAndConfirm(umi)
      .then((r) => {
        return { signature: base58.encode(r.signature) };
      });
    return response;
  } else {
    const response = await burnV1(umi, {
      asset: publicKey(assetId),
    })
      .sendAndConfirm(umi)
      .then((r) => {
        return { signature: base58.encode(r.signature) };
      });
    return response;
  }
};

export const createCollection = async ({
  wallet,
  connection,
  name,
  uri,
}: {
  wallet: Wallet;
  connection: Connection;
  name: string;
  uri: string;
}): Promise<BackendResponse> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(mplCore());
  umi.use(walletAdapterIdentity(wallet.adapter));
  const collectionSigner = generateSigner(umi);

  const result = await createCollectionV1(umi, {
    collection: collectionSigner,
    name: name,
    uri: uri,
  }).sendAndConfirm(umi);

  return {
    assetID: collectionSigner.publicKey,
    signature: base58.encode(result.signature),
  };
};
