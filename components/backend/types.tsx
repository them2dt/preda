import {
  DasApiAsset,
  DasApiAssetList,
} from "@metaplex-foundation/digital-asset-standard-api";
import { AssetV1 } from "@metaplex-foundation/mpl-core";
import {
  DigitalAsset,
  DigitalAssetWithToken,
} from "@metaplex-foundation/mpl-token-metadata";

/*
  0=function was not executed due to missing param
  200=OK 
  404=not found 
  500=unexpected Error 
  */
export type BackendResponse = {
  status: number;
  assetID?: string;
  signature?: string;
  coreAsset?: AssetV1;
  coreCollection?: string;
  tokenStandard?: number;
  dasList?: DasApiAssetList;
  digitalAsset?: DigitalAsset;
  digitalAssetWithToken?: DigitalAssetWithToken;
  tokenBalance?: { balance?: number; decimals?: number };
  errorMessage?: string;
};

export type Metadata = {
  name: string;
  symbol: string;
  description: string;
  royaltyPoints: number;
  imageUri: string;
  domain: string;
  attributes: { trait_value: string; value: string }[];
  collection: { name: string; family: string };
  properties: {
    files: { uri: string; type: string }[];
    category: string;
    creators: { adress: string; share: number }[];
  };
};
