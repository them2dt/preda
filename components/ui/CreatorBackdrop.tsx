import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { themes } from "../utils/simples";
import { CustomSlider } from "./TeaUI";

export default function CreatorBackdrop({
  renderHook,
  creators,
  creatorKey,
  creatorValue,
  setCreators,
  setRenderHook,
  setCreatorKey,
  setCreatorValue,
  setCreatorModal,
  theme,
  sliderValue,
  setSliderValue,
}: {
  setCreatorModal: (i: boolean) => void;
  renderHook: number;
  setRenderHook: (i: number) => void;
  creatorKey: string | undefined;
  creatorValue: number | undefined;
  setCreatorKey: (i: string) => void;
  setCreatorValue: (i: number) => void;
  creators: { address: string; share: number }[];
  setCreators: (i: { address: string; share: number }[]) => void;
  theme: number;
  sliderValue: number;
  setSliderValue: (i: number) => void;
}) {
  const removeCreator = (index: number) => {
    const oldArray = creators;
    if (oldArray) {
      oldArray.splice(index, 1);
      setCreators(oldArray);
      console.log(oldArray);
    }
  };
  return (
    <div
      className="backdrop flex-column-center-center"
      data-theme={themes[theme]}
      onClick={() => {
        setCreatorModal(false);
      }}
    >
      <div
        className="attributes"
        onClick={(e) => {
          e.stopPropagation();
        }}
        key={"creator-" + renderHook}
      >
        {creators?.map((attribute, index) => {
          return (
            <div
              className="attribute"
              key={"nft-creator-" + index}
              onClick={(e) => {
                e.stopPropagation();
                console.log("clicked.");
                removeCreator(index);
                setRenderHook(renderHook + 1);
              }}
            >
              <div className="key font-text-bold">{attribute.address}</div>

              <div className="line"></div>
              <div className="value font-text-light">
                {attribute.share.toString()}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="royalties flex-column-center-center"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="legend flex-row-between-center">
          <div className="font-text-small">royalties</div>
          <div className="font-text-small-bold">{sliderValue.toString()}%</div>
        </div>
        <div className="slider-container">
          <CustomSlider
            min={0}
            max={20}
            step={1}
            value={sliderValue} // Fix: Change the type of sliderValue to number
            onChange={(
              event: Event,
              value: number | number[],
              activeThumb: number
            ) => {
              if (typeof value == "number") {
                setSliderValue(value);
              }
            }}
          />
        </div>
      </div>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="create-attributes font-text">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input">
              <input
                type="text"
                className="key font-text"
                placeholder="Creator"
                required
                value={creatorKey}
                onChange={(e) => {
                  setCreatorKey(e.target.value);
                }}
              />
              <input
                type="number"
                min={0}
                max={100}
                value={creatorValue}
                className="value font-text"
                placeholder="Share (%)"
                required
                onChange={(e) => {
                  setCreatorValue(Number(e.target.value));
                }}
              />
            </div>
            <button
              className="submit font-text"
              type="submit"
              disabled={
                !creatorKey ||
                !/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(creatorKey) ||
                !creatorValue ||
                creatorValue < 0
              }
              onClick={() => {
                setCreators([
                  ...(creators || []),
                  {
                    address: creatorKey || "",
                    share: creatorValue || 0,
                  },
                ]);
                setCreatorKey("");
              }}
            >
              {!creatorKey ||
              !/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(creatorKey) ||
              !creatorValue ||
              creatorValue < 0
                ? "fill correctly in the fields"
                : "add"}
            </button>
          </form>
        </div>
      </div>
      {/* Button with x symbol */}
      <button
        onClick={() => {
          setCreatorModal(false);
        }}
        className="close-button"
      >
        <FontAwesomeIcon icon={faX} />
      </button>
    </div>
  );
}
