import { Wallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMintToInstruction } from "@solana/spl-token";
import { percentAmount } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createAssociatedTokenAccount } from "@solana/spl-token";
import { burnV1, createV1, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { enqueueSnackbar } from "notistack";

const createTokenAccount = async (wallet: any, mintAddress: string): Promise<string> => {
  try {
    // const connection = new Connection('https://api.mainnet-beta.solana.com'); // Use this for mainnet
    const connection = new Connection('https://api.devnet.solana.com');
    const tokenAccount = await createAssociatedTokenAccount(
      connection,
      wallet.owner,
      new PublicKey(mintAddress),
      wallet.owner,
    );
    console.log("Token account created: " + tokenAccount.toString());
    return tokenAccount.toString();
  } catch (error) {
    enqueueSnackbar("Error creating token account: " + error, { variant: "error" });
    return "Error creating token account: " + error;
  }
};

const mintToTokenAccount = async (wallet: any, mintAddress: string, tokenAccountAddress: string, amount: number): Promise<string> => {
  try {
    // const connection = new Connection('https://api.mainnet-beta.solana.com'); // Use this for mainnet
    const connection = new Connection('https://api.devnet.solana.com');
    const tokenAccount = new PublicKey(tokenAccountAddress);
    const mint = new PublicKey(mintAddress);
    const authority = wallet.publicKey;
    const recipient = tokenAccount;
    const decimals = 0;

    const instruction = createMintToInstruction(
      mint,
      recipient,
      authority,
      amount * Math.pow(10, decimals), 
      [],
      TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(instruction);

    const signature = await wallet.signTransaction(transaction);
    const result = await connection.sendRawTransaction(signature.serialize());
    console.log("Minted tokens to token account: " + tokenAccount.toString());
    return result;
  } catch (error) {
    enqueueSnackbar("Error minting tokens to token account: " + error, { variant: "error" });
    return "Error minting tokens to token account: " + error;
  }
};

export const createToken22 = async ({
  wallet,
  connection,
  name,
  symbol,
  decimals,
  metadata,
  sellerFeeBasisPoints,
  amount
}: {
  wallet: Wallet;
  connection: Connection;
  name: string;
  symbol: string;
  decimals: number;
  metadata: string;
  sellerFeeBasisPoints: number;
  amount: number;
}): Promise<string> => {
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  const mint = generateSigner(umi);

  try {
    const result = await createV1(umi, {
      mint: generateSigner(umi),
      name,
      symbol,
      decimals,
      uri: metadata,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
    }).sendAndConfirm(umi);

    console.log("Transaction hash: " + bs58.encode(result.signature));
    console.log("Mint: " + mint.publicKey);
    console.log("Signature: " + bs58.encode(result.signature));

    if (result.signature) {
      enqueueSnackbar("Token created", { variant: "success" });
      const tokenAccount = await createTokenAccount(wallet, mint.publicKey);
      console.log("Token account: " + tokenAccount);
      const mintResult = await mintToTokenAccount(wallet, mint.publicKey, tokenAccount, amount);
      console.log("Mint result: " + mintResult);
    }
    return mint.publicKey;
  } catch (error: any) {
    enqueueSnackbar("Error creating Token: " + error, { variant: "error" });
    console.error(error);
    throw new Error(`Error creating Token: ${error}`);
  }
};

export const burnToken22 = async ({
  wallet,
  connection,
  tokenMintAddress,
  amount,
}: {
  wallet: Wallet;
  connection: Connection;
  tokenMintAddress: string;
  amount: number;
}): Promise<string> => {
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  try {
    const result = await burnV1(umi, {
      mint: publicKey(tokenMintAddress),
      tokenStandard: TokenStandard.Fungible,
      amount,
      tokenOwner: umi.identity.publicKey,
    }).sendAndConfirm(umi);
    console.log("Mint: " + umi.identity.publicKey);
    console.log("Signature: " + bs58.encode(result.signature));
    return bs58.encode(result.signature);
  } catch (error) {
    enqueueSnackbar("Error burning Token22: " + error, { variant: "error" });
    return "Error burning Token22: " + error;
  }
};
