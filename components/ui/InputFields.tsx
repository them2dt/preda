"use client";
import React, { useState } from "react";
import { CustomSlider } from "./TeaUI";
import { validateImage } from "@/components/backend/General";

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
        <CustomSlider
          min={min}
          max={max}
          step={steps}
          value={value} // Fix: Change the type of sliderValue to number
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
          <div className="placeholder font-text-small">
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
