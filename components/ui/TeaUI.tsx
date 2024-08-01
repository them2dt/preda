"use client"
import { AnimatePresence, motion } from "framer-motion";;
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
    >
    </div>
  );
};
