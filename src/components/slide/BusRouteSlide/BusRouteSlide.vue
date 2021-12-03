<template>
  <Container :isPop="isPop">
    <button v-on:click="isPop = !isPop" class="close">✕</button>
    <h3>버스 노선 현황 정보</h3>
    <SectionRow>
      <label v-for="(route, index) in busRouteList" :key="index">
        {{ `${route.number}번` }}
        <input
          type="checkbox"
          :id="route.number"
          value="Mike"
          :v-model="route.number"
        />
      </label>
    </SectionRow>
    <TableSection>
      <table>
        <tr>
          <th v-for="(item, index) in routeDataDummyList.header" :key="index">
            {{ item }}
          </th>
        </tr>
        <tr v-for="(item, index) in routeDataDummyList.data" :key="index">
          <td>
            {{ item.busNumber }}
          </td>
          <td v-for="(datum, index) in item.data" :key="index">
            {{ datum }}
          </td>
        </tr>
      </table>
    </TableSection>
  </Container>
</template>
<script>
import styled from "vue-styled-components";

const ContainerProps = { isPop: Boolean };

const Container = styled("div", ContainerProps)`
  width: 680px;
  padding: 24px;
  padding-top: 96px;
  height: 100%;
  background-color: #fff;
  transition: all 0.3s ease-in;
  position: fixed;
  top: 0;
  left: ${(props) => (props.isPop ? "104px" : "-680px")};
  z-index: 9;
  text-align: left;
  button.close {
    position: absolute;
    top: 72px;
    right: 8px;
    width: 48px;
    height: 48px;
    /* border-radius: 50%; */
    outline: none;
    border: none;
    background-color: #fff;
    color: ${(props) => props.theme.color.ui.middle2};
    ${(props) => props.theme.layout.flexColCenter}
    font-size: 20px;
  }
`;
const SectionRow = styled.div`
  width: calc(100% - 48px);
  display: flex;
  flex-wrap: wrap;
  padding: 24px;
  border: solid 0.5px ${(props) => props.theme.color.ui.low};
  border-radius: 4px;
  margin-bottom: 24px;
  label {
    width: 20%;
    height: 32px;
    display: flex;
    align-items: center;
    input {
      margin-left: 8px;
    }
  }
`;

const TableSection = styled.div`
  width: 100%;
  height: calc(48px * 8);
  overflow-y: auto;
`;

export default {
  name: "BusRouteSlide",
  components: {
    Container,
    SectionRow,
    TableSection,
  },
  data() {
    return {
      busRouteList: [
        {
          number: 240,
          isCheck: false,
        },
        {
          number: 425,
          isCheck: false,
        },
        {
          number: 503,
          isCheck: false,
        },
        {
          number: 523,
          isCheck: false,
        },
        {
          number: 623,
          isCheck: false,
        },
        {
          number: 724,
          isCheck: false,
        },
        {
          number: 730,
          isCheck: false,
        },
        {
          number: 805,
          isCheck: false,
        },
        {
          number: 937,
          isCheck: false,
        },
      ],
      routeDataDummyList: {
        header: [
          "차량번호\n ",
          "초미세먼지\n(㎍/㎥)",
          "이산화질소\n(ppm)",
          "오존\n(ppm)",
          "온도\n(°C)",
          "습도\n(%)",
        ],
        data: [
          {
            busNumber: "5070",
            data: [23, 0.012, 0.0031, 35, 65],
          },
          {
            busNumber: "5070",
            data: [23, 0.012, 0.0031, 35, 65],
          },
          {
            busNumber: "5070",
            data: [23, 0.012, 0.0031, 35, 65],
          },
          {
            busNumber: "5070",
            data: [23, 0.012, 0.0031, 35, 65],
          },
          {
            busNumber: "5070",
            data: [23, 0.012, 0.0031, 35, 65],
          },
          {
            busNumber: "5070",
            data: [23, 0.012, 0.0031, 35, 65],
          },
          {
            busNumber: "5070",
            data: [23, 0.012, 0.0031, 35, 65],
          },
          {
            busNumber: "5070",
            data: [23, 0.012, 0.0031, 35, 65],
          },
          {
            busNumber: "5070",
            data: [23, 0.012, 0.0031, 35, 65],
          },
        ],
      },
    };
  },
  props: {
    isPop: Boolean,
  },
};
</script>