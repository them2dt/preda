import { AssetV1 } from "@metaplex-foundation/mpl-core";
import {
  DigitalAsset,
  DigitalAssetWithToken,
} from "@metaplex-foundation/mpl-token-metadata";
import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

export type BackendResponse = {
  status?: number;
  assetID?: string;
  signature?: string;
  coreAsset?: AssetV1;
  coreCollection?: string;
  digitalAsset?: DigitalAsset;
  digitalAssetWithToken?: DigitalAssetWithToken;
};

export type DefaultParams = {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
};
