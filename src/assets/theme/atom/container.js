import color from './color';

const container = {
  static: {
    // PRIMARY
    primaryOutlined: `
      border: solid 0.5px ${color.brand.primary700} !important;
      color: ${color.brand.primary700} !important;
    `,
    primaryFilled: `
      background-color: ${color.brand.primary700} !important;
      color: ${color.ui.white700} !important;
    `,
    // SUPPORTIVE (LIGHT SECONDARY)
    supportiveOutlined: `
      border: solid 0.5px ${color.brand.blueGray50} !important;
      color: ${color.brand.blueGray50} !important;
    `,
    supportiveFilled: `
      background-color: ${color.blueGray50} !important;
      color: ${color.ui.strong} !important;
    `,
    // WHITE
    whiteOutlined: `
      border: solid 0.5px ${color.ui.white700} !important;
      color: ${color.ui.white700} !important;
    `,
    whiteFilled: `
      background-color: ${color.ui.white700} !important;
      color: ${color.ui.strong} !important;
    `,
    // GRAY
    grayOutlined: `
      border: solid 0.5px ${color.ui.middle1} !important;
      color: ${color.ui.strong} !important;
    `,
    // GRAY LIGHT
    grayLightOutlined: `
    border: solid 0.5px ${color.ui.low} !important;
    color: ${color.ui.strong} !important;
  `,
  },
  interactive: {
    // PRIMARY
    primaryOutlined: {
      disable: `
        border: solid 0.5px ${color.brand.primary400} !important;
        color: ${color.brand.primary400} !important;
      `,
      enable: `
        border: solid 0.5px ${color.brand.primary700} !important;
        color: ${color.brand.primary700} !important;
      `,
      hover: `
        border: solid 0.5px ${color.brand.primary900} !important;
        color: ${color.brand.primary900} !important;
      `,
      active: `
        border: solid 0.5px ${color.brand.primary900} !important;
        color: ${color.brand.primary900} !important;
      `,
    },
    primaryFilled: {
      disable: `
        background-color: ${color.brand.primary400} !important;
        color: ${color.ui.white500} !important;
      `,
      enable: `
        background-color: ${color.brand.primary700} !important;
        color: ${color.ui.white700} !important;
      `,
      hover: `
        background-color: ${color.brand.primary900} !important;
        color: ${color.ui.white700} !important;
      `,
      active: `
        background-color: ${color.primary900} !important;
        color: ${color.ui.white700} !important;
      `,
    },
    // WHITE
    whiteOutlined: {
      disable: `
        border: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.low} !important;
      `,
      enable: `
        border: solid 0.5px ${color.ui.white500} !important;
        color: ${color.ui.white500} !important;
      `,
      hover: `
        border: solid 0.5px ${color.ui.white700} !important;
        color: ${color.ui.white700} !important;
      `,
      active: `
        border: solid 0.5px ${color.ui.white700} !important;
        color: ${color.ui.white700} !important;
      `,
    },
    whiteFilled: {
      disable: `
        background-color: ${color.ui.low} !important;
        color: ${color.ui.middle1} !important;
      `,
      enable: `
        background-color: ${color.ui.white500} !important;
        color: ${color.ui.middle1} !important;
      `,
      hover: `
        background-color: ${color.white700} !important;
        color: ${color.ui.middle2} !important;
      `,
      active: `
        background-color: ${color.white700} !important;
        color: ${color.ui.middle2} !important;
      `,
    },
    // GRAY
    grayOutlined: {
      disable: `
        border: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.low} !important;
      `,
      enable: `
        border: solid 0.5px ${color.ui.middle1} !important;
        color: ${color.ui.middle2} !important;
      `,
      hover: `
        border: solid 0.5px ${color.ui.middle2} !important;
        color: ${color.ui.strong} !important;
      `,
      active: `
        border: solid 0.5px ${color.ui.middle2} !important;
        color: ${color.ui.strong} !important;
      `,
    },
     // GRAY
     grayLightOutlined: {
      disable: `
        border: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.low} !important;
      `,
      enable: `
        border: solid 0.5px ${color.ui.low} !important;
        background-color: ${color.ui.white600} !important;
      `,
      hover: `
        border: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.strong} !important;
        background-color: ${color.ui.white700} !important;
      `,
      active: `
        border: solid 0.5px ${color.ui.low} !important;
        background-color: ${color.ui.white700} !important;
        color: ${color.ui.strong} !important;
      `,
    },
    // Red
    redOutlined: {
      disable: `
        border: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
        opacity: 0.64 !important;
      `,
      enable: `
        border: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
      `,
      hover: `
        border: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
      `,
      active: `
        border: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
      `,
    },
    redFilled: {
      disable: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
        opacity: 0.64 !important;
      `,
      enable: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
      `,
      hover: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
      `,
      active: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
      `,
    },
  },
  interactiveOutline: {
    // PRIMARY
    primaryOutlined: {
      disable: `
        outline: solid 0.5px ${color.brand.primary400} !important;
        color: ${color.brand.primary400} !important;
      `,
      enable: `
        outline: solid 0.5px ${color.brand.primary700} !important;
        color: ${color.brand.primary700} !important;
      `,
      hover: `
        outline: solid 0.5px ${color.brand.primary900} !important;
        color: ${color.brand.primary900} !important;
      `,
      active: `
        outline: solid 0.5px ${color.brand.primary900} !important;
        color: ${color.brand.primary900} !important;
      `,
    },
    primaryFilled: {
      disable: `
        background-color: ${color.brand.primary400} !important;
        color: ${color.ui.white500} !important;
      `,
      enable: `
        background-color: ${color.brand.primary700} !important;
        color: ${color.ui.white700} !important;
      `,
      hover: `
        background-color: ${color.brand.primary900} !important;
        color: ${color.ui.white700} !important;
      `,
      active: `
        background-color: ${color.primary900} !important;
        color: ${color.ui.white700} !important;
      `,
    },
    // WHITE
    whiteOutlined: {
      disable: `
        outline: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.low} !important;
      `,
      enable: `
        outline: solid 0.5px ${color.ui.white500} !important;
        color: ${color.ui.white500} !important;
      `,
      hover: `
        outline: solid 0.5px ${color.ui.white700} !important;
        color: ${color.ui.white700} !important;
      `,
      active: `
        outline: solid 0.5px ${color.ui.white700} !important;
        color: ${color.ui.white700} !important;
      `,
    },
    whiteFilled: {
      disable: `
        background-color: ${color.ui.low} !important;
        color: ${color.ui.middle1} !important;
      `,
      enable: `
        background-color: ${color.ui.white500} !important;
        color: ${color.ui.middle1} !important;
      `,
      hover: `
        background-color: ${color.white700} !important;
        color: ${color.ui.middle2} !important;
      `,
      active: `
        background-color: ${color.white700} !important;
        color: ${color.ui.middle2} !important;
      `,
    },
    // GRAY
    grayOutlined: {
      disable: `
        outline: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.low} !important;
      `,
      enable: `
        outline: solid 0.5px ${color.ui.middle1} !important;
        color: ${color.ui.middle2} !important;
      `,
      hover: `
        outline: solid 0.5px ${color.ui.middle2} !important;
        color: ${color.ui.strong} !important;
      `,
      active: `
        outline: solid 0.5px ${color.ui.middle2} !important;
        color: ${color.ui.strong} !important;
      `,
    },
     // GRAY
     grayLightOutlined: {
      disable: `
        outline: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.low} !important;
      `,
      enable: `
        outline: solid 0.5px ${color.ui.low} !important;
        background-color: ${color.ui.white600} !important;
      `,
      hover: `
        outline: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.strong} !important;
        background-color: ${color.ui.white700} !important;
      `,
      active: `
        outline: solid 0.5px ${color.ui.low} !important;
        background-color: ${color.ui.white700} !important;
        color: ${color.ui.strong} !important;
      `,
    },
    // Red
    redOutlined: {
      disable: `
        outline: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
        opacity: 0.64 !important;
      `,
      enable: `
        outline: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
      `,
      hover: `
        outline: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
      `,
      active: `
        outline: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
      `,
    },
    redFilled: {
      disable: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
        opacity: 0.64 !important;
      `,
      enable: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
      `,
      hover: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
      `,
      active: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
      `,
    },
  },
  // button
  button: {
    // PRIMARY
    primaryOutlined: {
      disable: `
        border: solid 0.5px ${color.brand.primary400} !important;
        color: ${color.brand.primary400} !important;
      `,
      enable: `
        border: solid 0.5px ${color.brand.primary700} !important;
        color: ${color.brand.primary700} !important;
      `,
      hover: `
        border: solid 0.5px ${color.brand.primary900} !important;
        color: ${color.brand.primary900} !important;
      `,
      active: `
        border : solid 0.5px ${color.brand.primary900} !important;
        color: ${color.brand.primary900} !important;
      `,
    },
    primaryFilled: {
      disable: `
        background-color: ${color.brand.primary400} !important;
        color: ${color.ui.white500} !important;
      `,
      enable: `
        background-color: ${color.brand.primary700} !important;
        color: ${color.ui.white700} !important;
      `,
      hover: `
        background-color: ${color.brand.primary900} !important;
        color: ${color.ui.white700} !important;
      `,
      active: `
        background-color: ${color.primary900} !important;
        color: ${color.ui.white700} !important;
      `,
    },
    // WHITE
    whiteOutlined: {
      disable: `
        border: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.low} !important;
      `,
      enable: `
        border: solid 0.5px ${color.ui.white500} !important;
        color: ${color.ui.white500} !important;
      `,
      hover: `
        border: solid 0.5px ${color.ui.white700} !important;
        color: ${color.ui.white700} !important;
      `,
      active: `
        border: solid 0.5px ${color.ui.white700} !important;
        color: ${color.ui.white700} !important;
      `,
    },
    whiteFilled: {
      disable: `
        background-color: ${color.ui.low} !important;
        color: ${color.ui.middle1} !important;
      `,
      enable: `
        background-color: ${color.ui.white500} !important;
        color: ${color.ui.middle1} !important;
      `,
      hover: `
        background-color: ${color.white700} !important;
        color: ${color.ui.middle2} !important;
      `,
      active: `
        background-color: ${color.white700} !important;
        color: ${color.ui.middle2} !important;
      `,
    },
    // GRAY
    grayOutlined: {
      disable: `
        border: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.low} !important;
      `,
      enable: `
        border: solid 0.5px ${color.ui.middle1} !important;
        color: ${color.ui.middle1} !important;
      `,
      hover: `
        border: solid 0.5px ${color.ui.middle2} !important;
        color: ${color.ui.strong} !important;
      `,
      active: `
        border: solid 0.5px ${color.ui.middle2} !important;
        color: ${color.ui.strong} !important;
      `,
    },
     // GRAY
     grayLightOutlined: {
      disable: `
        border: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.low} !important;
      `,
      enable: `
        border: solid 0.5px ${color.ui.low} !important;
        background-color: ${color.ui.white600} !important;
      `,
      hover: `
        border: solid 0.5px ${color.ui.low} !important;
        color: ${color.ui.strong} !important;
        background-color: ${color.ui.white700} !important;
      `,
      active: `
        border: solid 0.5px ${color.ui.low} !important;
        background-color: ${color.ui.white700} !important;
        color: ${color.ui.strong} !important;
      `,
    },
    // Red
    redOutlined: {
      disable: `
        border: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
        opacity: 0.64 !important;
      `,
      enable: `
        border: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
      `,
      hover: `
        border: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
      `,
      active: `
        border: solid 0.5px ${color.signal.warn} !important;
        color: ${color.signal.warn} !important;
      `,
    },
    redFilled: {
      disable: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
        opacity: 0.64 !important;
      `,
      enable: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
      `,
      hover: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
      `,
      active: `
        background-color: ${color.signal.warn} !important;
        color: ${color.ui.white700} !important;
      `,
    },
  },
  chip:{
    enable: `
      background-color: ${color.brand.secondary50} !important;
      color: ${color.ui.middle1} !important;
    `,
    hover: `
      background-color: ${color.brand.secondary100} !important;
      color: ${color.ui.strong} !important;
    `,
    selected: `
      border: solid 2px ${color.brand.primary700} !important;
      background-color: ${color.brand.secondary50} !important;
      color: ${color.ui.strong} !important;
    `,
  },
  elevation: {
		level1Block: `
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08) !important;
    `,
	},
}

export default container;