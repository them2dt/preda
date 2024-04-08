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
import { mplCore, createV1 } from "@metaplex-foundation/mpl-core";

export const createCoreAsset = async ({
  wallet,
  connection,
  name,
  metadata,
  collectionId,
}: {
  wallet: Wallet;
  connection: Connection;
  name: string;
  metadata: string;
  collectionId?: string;
}) => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplCore());
  umi.use(walletAdapterIdentity(wallet.adapter));

  const assetId = generateSigner(umi);
  const transaction = new TransactionBuilder();
  if (collectionId) {
    //Creating a Collection NFT
    transaction.add(
      createV1(umi, {
        asset: assetId,
        name: name,
        uri: metadata,
        collection: publicKey(collectionId),
      })
    );
  } else {
    //Creating a Single NFT
    transaction.add(
      createV1(umi, {
        asset: assetId,
        name: name,
        uri: metadata,
      })
    );
  }

  const result = await transaction.sendAndConfirm(umi);
  if (result) {
    console.log("success");
  }
};
