// ARCHIVED
import { BackendResponse } from "@/components/backend/types";
import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { enqueueSnackbar } from "notistack";

export const backendWrapper = async ({
  initialMessage,
  wallet,
  connection,
  backendCall,
}: {
  initialMessage?: string;
  wallet: Wallet;
  connection: Connection;
  backendCall: () => Promise<BackendResponse>;
}): Promise<BackendResponse> => {
  if (initialMessage) {
    enqueueSnackbar(initialMessage, { variant: "info" });
  }

  if (wallet) {
    if (wallet.adapter) {
      if (wallet.adapter.connected) {
        if (connection) {
          try {
            const response = await backendCall();
            if (response.status == 200) {
              enqueueSnackbar("Success.", { variant: "success" });
            } else {
              console.log(
                "----------------------------------------------------------"
              );
              console.log("AN ERROR OCCURED.");
              console.log(
                "----------------------------------------------------------"
              );
              console.log("Status: " + response.status);
              console.log("Message: " + response.errorMessage);
              console.log(
                "----------------------------------------------------------"
              );
            }
            return response;
          } catch (e) {
            console.log(
              "----------------------------------------------------------"
            );
            console.log("AN ERROR OCCURED.");
            console.log(
              "----------------------------------------------------------"
            );
            console.log(e);
            console.log(
              "----------------------------------------------------------"
            );

            enqueueSnackbar("Unknown Error.", {
              variant: "error",
            });
            return { status: 500 };
          }
        } else {
          enqueueSnackbar("Couldn't find connection.", { variant: "error" });
          return { status: 0 };
        }
      } else {
        enqueueSnackbar("Wallet is not connected", { variant: "error" });
        return { status: 0 };
      }
    } else {
      enqueueSnackbar("Wallet adapter not found.", { variant: "error" });
      return { status: 0 };
    }
  } else {
    enqueueSnackbar("Wallet not found.", { variant: "error" });
    return { status: 0 };
  }
};