"use client";
import { getAsset, getDigitalAssetBalance } from "@/backend/General";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CustomSlider } from "../Slider";
import { enqueueSnackbar } from "notistack";
import { burnSPL20 } from "@/backend/SPL20";
import { backendWrapper } from "../BackendWrapper";
import ResultPanel from "../ResultPanel";
import { BackendResponse } from "@/types";

export default function Panel() {
  const [decimals, setDecimals] = useState<number>(0);
  const [supply, setSupply] = useState<number>(0);
  const [maxSupply, setMaxSupply] = useState<number>(0);
  const [token, setToken] = useState<string>();
  const [tokenVerified, setTokenVerified] = useState<boolean>(false);
  const [result, setResult] = useState<BackendResponse>();

  const { wallet } = useWallet();
  const { connection } = useConnection();

  const validate = async () => {
    const runner_1 = getAsset({
      wallet: wallet,
      connection: connection,
      assetId: token,
    });
    const runner_2 = getDigitalAssetBalance({
      wallet: wallet,
      connection: connection,
      assetId: token,
    });
    const response_1 = await backendWrapper({
      wallet: wallet,
      connection: connection,
      backendCall: async () => await runner_1,
      initialMessage: "Fetching digital asset",
    });
    const response_2 = await backendWrapper({
      wallet: wallet,
      connection: connection,
      backendCall: async () => await runner_2,
      initialMessage: "Fetching balance of digital asset",
    });
    if (response_1.status == 200) {
      if (response_1.tokenStandard == 2) {
        if (response_2.status == 200) {
          if (
            response_2.tokenBalance.balance &&
            response_2.tokenBalance.decimals
          ) {
            setTokenVerified(true);
            setDecimals(response_1.tokenBalance.decimals);
            setMaxSupply(response_1.tokenBalance.balance);
          } else {
            enqueueSnackbar("You don't hold any tokens.", { variant: "error" });
          }
        }
      } else {
        enqueueSnackbar("Wrong token standard.", { variant: "error" });
      }
    }
  };

  const burn = async () => {
    const runner = burnSPL20({
      wallet: wallet,
      connection: connection,
      assetId: token,
      amount: supply,
    });
    const response = await backendWrapper({
      initialMessage: "Burning SPL20",
      wallet: wallet,
      connection: connection,
      backendCall: async () => await runner,
    });
    setResult(response);
  };

  return (
    <>
      <div className="panel-container flex-column-start-center">
        <div className="font-h3">Burn SPL20-Tokens</div>

        <div className="panel flex-row-start-center">
          <input
            type="text"
            name="title"
            placeholder="Address of your token"
            className="font-text-small"
            onChange={(e) => {
              setTokenVerified(false);
              setToken(e.target.value);
            }}
          />
          <div className="button-base">
            <button
              disabled={!wallet || !connection || !token}
              className="button flex-row-center-center font-text-tiny-bold"
              onClick={async () => {
                await validate();
              }}
            >
              Verify Token
            </button>
          </div>
        </div>
        <div
          id="lab-panel-spl"
          className={
            tokenVerified ? "panel spl-burn" : "panel spl-burn disabled"
          }
        >
          <div className="flex-column-center-center form-container">
            <div className="flex-row-center-start form">
              <div className="royalties flex-column-center-center">
                <div className="legend flex-row-center-center">
                  <div className="font-text-small-bold">
                    {(supply / 10 ** decimals).toString()}
                  </div>
                </div>
                <div className="slider-container">
                  <CustomSlider
                    min={0}
                    max={maxSupply}
                    onChange={(
                      event: Event,
                      value: number | number[],
                      activeThumb: number
                    ) => {
                      if (typeof value == "number") {
                        setSupply(value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <button
              className="submit font-text-tiny-bold flex-row-center-center"
              disabled={supply == 0}
              onClick={burn}
            >
              {supply == 0
                ? "Choose the amount to burn."
                : "Burn " + (supply / 10 ** decimals).toString() + " Tokens"}
            </button>
          </div>
        </div>
      </div>
      {result && <ResultPanel result={result} setResult={setResult} />}
    </>
  );
}
