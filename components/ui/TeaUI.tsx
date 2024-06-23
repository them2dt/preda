"use client";
import React, { useState } from "react";
import { validateImage } from "@/components/backend/General";

import { styled, alpha } from "@mui/system";
import { Slider as BaseSlider, sliderClasses } from "@mui/base/Slider";

export const Slider = styled(BaseSlider)(
  ({ theme }) => `
  color: var(--accent);
  height: 4px;
  width: 100%;
  padding: 16px 0;
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;

  &.${sliderClasses.disabled} { 
    pointer-events: none;
    cursor: default;
    color: green;
    opacity: 0.4;
  }

  & .${sliderClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 4px;
    border-radius: 6px;
    background-color: currentColor;
    opacity: 0.3;
  }

  & .${sliderClasses.track} {
    display: block;
    position: absolute;
    height: 4px;
    border-radius: 6px;
    background-color: currentColor;
  }

  & .${sliderClasses.thumb} {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    margin-left: -6px;
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    background-color: var(--accent-faded-4);
    transition-property: box-shadow, transform;
    transition-timing-function: ease;
    transition-duration: 120ms;
    transform-origin: center;

    &:hover {
      box-shadow: 0 0 0 6px ${alpha("#111111", 0.3)};
    }

    &.${sliderClasses.focusVisible} {
      box-shadow: 0 0 0 8px ${alpha("#111111", 0.5)};
      outline: none;
    }

    &.${sliderClasses.active} {
      box-shadow: 0 0 0 8px ${alpha("#111111", 0.5)};
      outline: none;
      transform: scale(1.2);
    }
    
    &.${sliderClasses.disabled} {
      background-color: ${"var(-accent)"};
    }
  }
`
);
export const Switch = ({
  hook,
  state,
}: {
  hook: () => void;
  state: boolean;
}) => {
  const run = () => {
    hook();
  };
  return (
    <button onClick={run} className={state ? "switch active" : "switch"}>
      <div className="button"></div>
    </button>
  );
};
export const Signal = ({ state }: { state: boolean }) => {
  return (
    <div
      className={
        state
          ? "signal active flex-row-center-center"
          : "signal flex-row-center-center"
      }
    ></div>
  );
};
export function TextField({
  label,
  setValue,
}: {
  label: string;
  setValue: (i: string) => void;
}) {
  const [active, setActive] = useState<boolean>(false);
  return (
    <div className="input-field flex-column-center-start">
      <div
        className={
          active ? "label active font-text-tiny" : "label font-text-tiny"
        }
      >
        {label}
      </div>
      <input
        type="text"
        className="font-text"
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
          setActive(true);
        }}
        onBlur={() => {
          setActive(false);
        }}
      />
    </div>
  );
}
export function TextArea({
  label,
  setValue,
}: {
  label: string;
  setValue: (i: string) => void;
}) {
  const [active, setActive] = useState<boolean>(false);
  return (
    <div className="input-field flex-column-center-start">
      <div
        className={
          active ? "label active font-text-tiny" : "label font-text-tiny"
        }
      >
        {label}
      </div>
      <textarea
        className="font-text"
        minLength={100}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
          setActive(true);
        }}
        onBlur={() => {
          setActive(false);
        }}
      />
    </div>
  );
}
export function NumberField({
  label,
  setValue,
  min,
  max,
}: {
  label: string;
  setValue: (i: number) => void;
  min: number;
  max: number;
}) {
  const [active, setActive] = useState<boolean>(false);
  return (
    <div className="input-field flex-column-center-start">
      <div
        className={
          active ? "label active font-text-tiny" : "label font-text-tiny"
        }
      >
        {label}
      </div>
      <input
        type="number"
        min={min}
        max={max}
        className="font-text"
        onChange={(e) => setValue(Number(e.target.value))}
        onFocus={() => {
          setActive(true);
        }}
        onBlur={() => {
          setActive(false);
        }}
      />
    </div>
  );
}
export function SwitchField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: boolean;
  setValue: (i: boolean) => void;
}) {
  const [active, setActive] = useState<boolean>(false);
  return (
    <div className="input-field flex-column-center-start">
      <div
        className={
          active ? "label active font-text-tiny" : "label font-text-tiny"
        }
      >
        {label}
      </div>
      <Switch
        hook={() => {
          setValue(!value);
        }}
        state={value}
      />
    </div>
  );
}
export function Slidable({
  label,
  value,
  setValue,
  min,
  max,
  steps,
}: {
  label: string;
  value: number;
  setValue: (i: number) => void;
  min: number;
  max: number;
  steps: number;
}) {
  return (
    <div className="input-field slidable flex-column-center-start">
      <div className="label font-text-tiny">{label}</div>
      <div className="slider-container flex-row-center-center">
        <div className="font-text-small-bold">{value}%</div>
        <Slider
          min={min}
          max={max}
          step={steps}
          onChange={(
            event: Event,
            value: number | number[],
            activeThumb: number
          ) => {
            if (typeof value == "number") {
              setValue(value);
            }
          }}
        />
      </div>
    </div>
  );
}
export function ImageInput({
  image,
  imagePreview,
  setImage,
  setImagePreview,
}: {
  image: File | undefined;
  imagePreview: string | undefined;
  setImage: Function;
  setImagePreview: Function;
}) {
  return (
    <div className="input-field flex-column-center-start">
      <div className="label font-text-tiny">Image</div>
      <div
        className="image-preview flex-row-center-center"
        onClick={() => {
          const imageInput = document.getElementById("image-input");
          if (imageInput) {
            imageInput.click();
          }
        }}
      >
        {image ? (
          <img src={imagePreview} alt="image-preview" />
        ) : (
          <div className="placeholder flex-column-center-center font-text-tiny">
            click here to import an image
          </div>
        )}
        <input
          type="file"
          name="cover"
          id="image-input"
          accept="image/png"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              validateImage(e.target.files[0], setImage, setImagePreview);
              console.log(e.target.files[0].name);
            }
          }}
        />
      </div>
    </div>
  );
}
