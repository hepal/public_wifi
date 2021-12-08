<template>
    <table>
      <tr>
        <Header v-for="(item, index) in tableData.header" :key="index">
          {{ item }}
        </Header>
      </tr>
      <tr v-for="(item, index) in tableData.data" :key="index">
        <td>
          {{ item.busNumber }}
        </td>
        <VisualTd
          v-for="(datum, index) in item.data"
          :key="index"
          :code="levelValidator(datum.value, datum.type)"
        >
          {{ datum.value }}
        </VisualTd>
      </tr>
    </table>
</template>
<script>
import styled from "vue-styled-components";
import { TYPE, CODE, SCALE } from "../../../globalConst/indicatorCode";


const TdProps = { code: String };

const Header = styled.th`
  position: sticky;
  top: 0;
  z-index: 9;
`;  

const VisualTd = styled('td', TdProps)`
  position: relative;
  color: ${(props) => {
    switch (props.code) {
      case CODE.GOOD:
        return props.theme.color.level.good;
      case CODE.NORMAL:
        return props.theme.color.level.normal;
      case CODE.BAD:
        return props.theme.color.level.bad;
      case CODE.WORSE:
        return props.theme.color.level.worse;
      default:
        return props.theme.color.ui.strong;
    }
  }};

  :before {
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    bottom: 6px;
    left: calc(50% - 3px);
    border-radius: 50%;
    background-color: ${(props) => {
      switch (props.code) {
        case CODE.GOOD:
          return props.theme.color.level.good;
        case CODE.NORMAL:
          return props.theme.color.level.normal;
        case CODE.BAD:
          return props.theme.color.level.bad;
        case CODE.WORSE:
          return props.theme.color.level.worse;
        default:
          return "none";
      }
    }};
  }
`;

export default {
  name: "KeyIndicatorTable",
  components: {
    VisualTd,
    Header
  },
  props: {
    tableData: Object,
  },
  data() {
    return {
      TYPE,
      CODE,
      SCALE,
    };
  },
  methods: {
    levelValidator(value, type) {
      if (type === TYPE.DUST || type === TYPE.NO2 || type === TYPE.O3) {
        if (value < SCALE[type][1]) return CODE.GOOD;
        else if (value < SCALE[type][2]) return CODE.NORMAL;
        else if (value < SCALE[type][3]) return CODE.BAD;
        else return CODE.WORSE;
      } else {
        return CODE.NONE;
      }
    },
  },
};
</script>