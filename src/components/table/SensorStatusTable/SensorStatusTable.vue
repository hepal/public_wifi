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
          :code="levelValidator(datum.value)"
        >
          {{ datum.value?'양호':'불량' }}
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
  ${props => props.theme.type.size.caption};

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
    levelValidator(value) {
      if(value===true){
        return CODE.NORMAL;
      }else if(value===false){
        return CODE.WORSE;
      }
    },
  },
};
</script>