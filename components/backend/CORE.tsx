import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
//umi
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, generateSigner } from "@metaplex-foundation/umi";
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
  try {
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

      const result = await transaction.sendAndConfirm(umi);
      return {
        status: 200,
        assetID: assetId.publicKey,
        signature: base58.encode(result.signature),
      };
    } else {
      const transaction = createV1(umi, {
        asset: assetId,
        name: name,
        uri: metadata,
      });
      const result = await transaction.sendAndConfirm(umi);
      return {
        status: 200,
        assetID: assetId.publicKey,
        signature: base58.encode(result.signature),
      };
    }
  } catch (e) {
    return { status: 500, errorMessage: String(e) };
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
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(mplCore());
    umi.use(walletAdapterIdentity(wallet.adapter));

    if (collection) {
      const result = await updateV1(umi, {
        asset: publicKey(assetId),
        newName: name,
        newUri: metadata,
        collection: publicKey(collection),
      }).sendAndConfirm(umi);
      return {
        status: 200,
        assetID: assetId,
        signature: base58.encode(result.signature),
      };
    } else {
      const result = await updateV1(umi, {
        asset: publicKey(assetId),
        newName: name,
        newUri: metadata,
      }).sendAndConfirm(umi);
      return {
        status: 200,
        assetID: assetId,
        signature: base58.encode(result.signature),
      };
    }
  } catch (e) {
    return { status: 500, errorMessage: String(e) };
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
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(mplCore());
    umi.use(walletAdapterIdentity(wallet.adapter));

    const asset = await fetchAssetV1(umi, publicKey(assetId));
    return { status: 200, assetID: asset.publicKey, coreAsset: asset };
  } catch (e) {
    return { status: 500, errorMessage: String(e) };
  }
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
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(mplCore());
    umi.use(walletAdapterIdentity(wallet.adapter));

    const fetchedAsset = await fetchAsset({
      connection: connection,
      wallet: wallet,
      assetId: assetId,
    });

    if (collection) {
      const response = await burnV1(umi, {
        asset: publicKey(assetId),
        collection: publicKey(collection),
      }).sendAndConfirm(umi);
      return { status: 200, signature: base58.encode(response.signature) };
    } else {
      const response = await burnV1(umi, {
        asset: publicKey(assetId),
      }).sendAndConfirm(umi);

      return { status: 200, signature: base58.encode(response.signature) };
    }
  } catch (e) {
    return { status: 500, errorMessage: String(e) };
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
  try {
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
      status: 200,
      assetID: collectionSigner.publicKey,
      signature: base58.encode(result.signature),
    };
  } catch (e) {
    return { status: 500, errorMessage: String(e) };
  }
};
