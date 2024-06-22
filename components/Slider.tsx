import { styled, alpha } from "@mui/system";
import { Slider as BaseSlider, sliderClasses } from "@mui/base/Slider";

const blue = {
  50: "#E6D4FF",
  100: "#D1A8FF",
  200: "#BC7CFF",
  300: "#A750FF",
  400: "#9234FF",
  500: "#7D08FF",
  600: "#6F00E6",
  700: "#5B00B3",
  800: "#470080",
  900: "#33004D",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

export const CustomSlider = styled(BaseSlider)(
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
      box-shadow: 0 0 0 6px ${alpha(
        "#111111",
        0.3
      )};
    }

    &.${sliderClasses.focusVisible} {
      box-shadow: 0 0 0 8px ${alpha(
        "#111111",
        0.5
      )};
      outline: none;
    }

    &.${sliderClasses.active} {
      box-shadow: 0 0 0 8px ${alpha(
        "#111111",
        0.5
      )};
      outline: none;
      transform: scale(1.2);
    }
    
    &.${sliderClasses.disabled} {
      background-color: ${
        "var(-accent)"
      };
    }
  }
`
);
