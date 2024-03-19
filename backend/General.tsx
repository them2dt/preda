//TODO: Implement the functions.

import { Wallet } from "@solana/wallet-adapter-react";

//solana
import {
  Metaplex,
  WalletAdapter,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import {
  Keypair,
  PublicKey,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
//Irys
import { WebIrys } from "@irys/sdk";
import { Adapter } from "@solana/wallet-adapter-base";
import { enqueueSnackbar } from "notistack";
import axios from "axios";

//function which takes a file and validates whether it is an image and fulfills the requirements (size, format, etc.)
export async function validateImage(
  input: File,
  setImage: Function,
  setImagePreview: Function
): Promise<boolean> {
  if (input != undefined) {
    // Check if input is defined
    if (input.type == "image/png") {
      // Check if input type is PNG
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.src = e.target?.result?.toString() || "";
        img.onload = function () {
          if (img.width == img.height) {
            // Check if image is square
            setImage(input); // Set the image if it meets the criteria
            enqueueSnackbar("Image is valid", { variant: "success" });
            setImagePreview([reader.result]);
            return true; // Return the image if it meets the criteria
          } else {
            console.log("not square");
            enqueueSnackbar("Image has to be square format.", {
              variant: "warning",
            });
            return false; // Return undefined if image is not square
          }
        };
      };
      reader.readAsDataURL(input); // Read the image file
    } else {
      enqueueSnackbar("Image has to be a png.", { variant: "warning" });

      return false; // Return undefined if input type is not PNG
    }
  } else {
    console.log("no input");
    return false; // Return undefined if input is not defined
  }
  return false;
}

async function getIrys({
  wallet,
  connection,
}: {
  wallet: Wallet;
  connection: Connection;
}) {
  const providerUrl = connection.rpcEndpoint;
  const useProvider = wallet?.adapter as Adapter;
  await useProvider.connect();

  const irys = new WebIrys({
    url: "https://devnet.irys.xyz", // URL of the node you want to connect to
    token: "solana", // Token used for payment
    wallet: {
      provider: useProvider,
    },
    config: { providerUrl }, // Optional provider URL, only required when using Devnet
  });
  return irys;
}
export async function uploadFileToIrys({
  wallet,
  connection,
  file,
}: {
  wallet: Wallet;
  connection: Connection;
  file: File;
}): Promise<string> {
  const bundler = await getIrys({ wallet: wallet, connection: connection });
  const state = await bundler.ready();
  const imagePrice = await bundler.getPrice(file.size + 1048576);
  const funds = await bundler.fund(imagePrice);

  console.log(
    "Image price: " + imagePrice.toNumber() / LAMPORTS_PER_SOL + " SOL"
  );

  const fileArrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(fileArrayBuffer);
  const imageUpload = bundler.createTransaction(fileBuffer, {
    tags: [{ name: "Content-Type", value: file.type }],
  });
  const sign = await imageUpload.sign();
  const upload = await imageUpload.upload();
  console.log(
    "Uploaded " +
      file.name +
      "." +
      file.type +
      ": https://arweave.net/" +
      upload.id
  );

  return "https://arweave.net/" + upload.id;
}

export async function loadNFTs({
  wallet,
  endpoint,
}: {
  wallet: Wallet;
  endpoint: string;
}): Promise<
  {
    name: string;
    mint: string;
    imageUri: string;
    updateAuthority: string;
    attributes: { trait_type: string; value: string }[];
    tokenStandard: string;
  }[]
> {
  console.log("Loading NFTs");
  const ts = ["NFT", "PNFT", "CNFT"];
  const connection = new Connection(endpoint, "confirmed");
  const metaplex = new Metaplex(connection);
  const walletAdapter: WalletAdapter = {
    publicKey: wallet.adapter.publicKey,
  };
  metaplex.use(walletAdapterIdentity(walletAdapter));
  const nfts = await metaplex
    .nfts()
    .findAllByOwner({ owner: walletAdapter.publicKey || PublicKey.default });
  const array = [];

  for (let i = 0; i < nfts.length; i++) {
    const response = await axios.get(nfts[i].uri);
    console.log(response);
    const data = response.data;
    const jsonObject = JSON.stringify(data);

    console.log("--------------------");
    console.log(jsonObject);
    console.log("--------------------");
    const formattedItem = {
      name: nfts[i].name,
      mint: nfts[i].address.toBase58(),
      imageUri: data.image || "",
      updateAuthority: nfts[i].updateAuthorityAddress.toBase58(),
      attributes: data.attributes,
      tokenStandard: ts[nfts[i].tokenStandard || 0],
    };
    array.push(formattedItem);
    console.log(formattedItem);
  }
  console.log(array);
  return array;
}

export async function loadTokenAccounts({
  wallet,
  connection,
}: {
  wallet: string;
  connection: Connection;
}) {
  const owner = new PublicKey(wallet);
  const response = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });
  console.log("--------------------");
  console.log("--------------------");
  console.log("--------------------");
  response.value.forEach((accountInfo) => {
    console.log(`pubkey: ${accountInfo.pubkey.toBase58()}`);
    console.log(`mint: ${accountInfo.account.data["parsed"]["info"]["mint"]}`);
    console.log(
      `owner: ${accountInfo.account.data["parsed"]["info"]["owner"]}`
    );
    console.log(
      `decimals: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["decimals"]}`
    );
    console.log(
      `amount: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["amount"]}`
    );
    console.log("====================");
  });
  console.log("--------------------");
  console.log("--------------------");
  console.log("--------------------");
}
