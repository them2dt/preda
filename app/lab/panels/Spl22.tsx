import React, { useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { CustomSlider } from "@/components/ui/Slider";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { enqueueSnackbar } from "notistack";
import { createToken22, burnToken22 } from "@/backend/SPL22";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { string } from "@metaplex-foundation/umi/serializers";

export default function Panel() {
  const { wallet } = useWallet();
  const { connection } = useConnection();

  const [attributeModal, setAttributeModal] = useState(false);
  //rerenders the attribute-modal on every change.
  const [renderHook, setRenderHook] = useState<number>(0);
  //sets the title of NFT.
  const [name, setName] = useState<string>();
  //sets the symbol of NFT. 
  const [symbol, setSymbol] = useState<string>();
  //sets the description of NFT.
  const [description, setDescription] = useState<string>();
  //sets the image of NFT.
  const [image, setImage] = useState<File>();
  //sets the image-preview of NFT.
  const [imagePreview, setImagePreview] = useState<string>();
  //sets the title of NFT.
  const [sliderValue, setSliderValue] = useState<number>(0);
  // hooks to store the key and value of the attribute to be added.
  const [key, setKey] = useState<string>();
  const [value, setValue] = useState<string>();
  // a hook with the type of an array of objects, which contains the key and value of the attribute.
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>();

  const [frozen, setFrozen] = useState<boolean>(false);
  const [transferTax, setTransferTax] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [authority, setAuthority] = useState<string>();
  
  //hooks to store the key and value of the attribute to be added.
  const removeAttribute = (index: number) => {
    const oldArray = attributes;
    if (oldArray) {
      oldArray.splice(index, 1);
      console.log(oldArray);
    }
  };

  const run = async () => {
    if (!wallet || !connection || !name || !symbol || !description || !image) {
      enqueueSnackbar("Fill out the empty fields.", {
        variant: "error",
      });
    } else {
      enqueueSnackbar("Uploading image...", { variant: "info" });
      const imageUri = await uploadFileToIrys({
        wallet: wallet,
        connection: connection,
        file: image,
      });

      if (imageUri) {
        const tokenMintAddress = await uploadFileToIrys({
          wallet,
          connection: connection,
          file: image,
        });

        const metadata = {
          name: name,
          symbol: symbol,
          description: description,
          seller_fee_basis_points: sliderValue,
          image: imageUri,
          external_url: "emptea.xyz",
          properties: {
            files: [{ uri: imageUri, type: "image/png" }],
            category: "image",
            creators: [
              {
                address:
                  wallet.adapter.publicKey?.toBase58() ||
                  "DFoRBzY3odkJ53FgCeSj26Ps6Bk7tuZ5kaV47QsyrqnV",
                share: 100,
              },
            ],
            supply: 1,
            decimals: 9,
          },
          collection: {},
        };
        const metadataFile = new File(
          [JSON.stringify(metadata)],
          "metadata.json",
          { type: "application/json" }
        );
        const metadataUri = await uploadFileToIrys({
          wallet: wallet,
          connection: connection,
          file: metadataFile,
        });

        if (metadataUri) {
          const mint = await createToken22({
            wallet: wallet,
            connection: connection,
            name: "Your Token Name",
            symbol: "YTN",
            decimals: 9,
            metadata: metadataUri,
            sellerFeeBasisPoints: sliderValue,
          });

        if (mint) {
          enqueueSnackbar("Token created!", { variant: "success" });
        } else {
          enqueueSnackbar("Error creating token.", { variant: "error" });
        }
      } else {
        enqueueSnackbar("Image upload failed.", { variant: "error" });
      }
    }
  };
}

return (
  <div>
    <h1>Create NFT Panel</h1>
    <input
      type="text"
      placeholder="Name"
      onChange={(e) => setName(e.target.value)}
    />
    <input
      type="text"
      placeholder="Symbol"
      onChange={(e) => setSymbol(e.target.value)}
    />
    <textarea
      placeholder="Description"
      onChange={(e) => setDescription(e.target.value)}
    />
    <CustomSlider value={sliderValue} setValue={setSliderValue} />
    <div style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
          }
        }}
      />
      {imagePreview && <img src={imagePreview} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
    </div>
    <button onClick={run}>Create NFT</button>
  </div>
);}