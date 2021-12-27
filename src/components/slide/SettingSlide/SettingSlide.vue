<template>
  <Container :isPop="true">
    <!-- <button v-on:click="togglePop" class="close">✕</button> -->
    <h3>측정기 연결 상태</h3>
    <SectionRow>
      <CheckContainer v-for="(route, index) in busRouteList" :key="index">
        <input
          type="checkbox"
          :id="route.number"
          :value="route.number"
          v-model="checkedNames"
        />
        <label :for="route.number">
          {{ `${route.number}` }}
        </label>
      </CheckContainer>
    </SectionRow>
    <TableSection>
      <SensorStatusTable :tableData="routeDataDummyList" />
    </TableSection>
    <LegendSensor> </LegendSensor>
  </Container>
</template>
<script>
import styled from "vue-styled-components";
import { TYPE, CODE, SCALE } from "../../../globalConst/indicatorCode";
import SensorStatusTable from "@/components/table/SensorStatusTable/SensorStatusTable";
import LegendSensor from "@/components/table/SensorStatusTable/LegendSensor";

// Assets
import ic_refrsh from "../../../assets/icon/action/refresh.svg";

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
  left: ${(props) => (props.isPop ? "104px" : "-728px")};
  z-index: 99;
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
  padding: 16px;
  border: solid 0.5px ${(props) => props.theme.color.ui.low};
  border-radius: 4px;
  margin-bottom: 24px;
`;

const CheckContainer = styled.div`
  width: 20%;
  height: 32px;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  label {
  }
  input {
    margin-right: 12px;
  }
`;

const TableSection = styled.div`
  width: 100%;
  height: auto;
  max-height: calc(48px * 12);
  overflow-y: auto;
  margin-bottom: 24px;
  table{
    margin-bottom: 0px !important;
  }
  td,
  th,
  tr {
    padding: 0px !important;
    text-align: center !important;
  }
`;

export default {
  name: "BusRouteSlide",
  components: {
    Container,
    SectionRow,
    TableSection,
    SensorStatusTable,
    LegendSensor,
    CheckContainer,
  },
  data() {
    return {
      CODE,
      SCALE,
      TYPE,
      ic_refrsh,
      checkedNames: ["모두 선택"],
      measureTime: "2021-10-21  13:11:29",
      busRouteList: [
        {
          number: "모두 선택",
          isCheck: true,
        },
        {
          number: "240번",
          isCheck: false,
        },
        {
          number: "425번",
          isCheck: false,
        },
        {
          number: "503번",
          isCheck: false,
        },
        {
          number: "523번",
          isCheck: false,
        },
        {
          number: "623번",
          isCheck: false,
        },
        {
          number: "724번",
          isCheck: false,
        },
        {
          number: "730번",
          isCheck: false,
        },
        {
          number: "805번",
          isCheck: false,
        },
        {
          number: "937번",
          isCheck: false,
        },
      ],
      routeDataDummyList: {
        header: [
          "노선(차량번호)",
          "초미세먼지",
          "이산화질소",
          "오존",
          "온도",
          "습도",
        ],
        data: [
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: false },
              { type: TYPE.NO2, value: true },
              { type: TYPE.O3, value: true },
              { type: TYPE.TEMPERATURE, value: true },
              { type: TYPE.HUMID, value: true },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: true },
              { type: TYPE.NO2, value: true },
              { type: TYPE.O3, value: true },
              { type: TYPE.TEMPERATURE, value: true },
              { type: TYPE.HUMID, value: true },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: true },
              { type: TYPE.NO2, value: true },
              { type: TYPE.O3, value: true },
              { type: TYPE.TEMPERATURE, value: true },
              { type: TYPE.HUMID, value: true },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: true },
              { type: TYPE.NO2, value: false },
              { type: TYPE.O3, value: true },
              { type: TYPE.TEMPERATURE, value: true },
              { type: TYPE.HUMID, value: true },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: false },
              { type: TYPE.NO2, value: true },
              { type: TYPE.O3, value: false },
              { type: TYPE.TEMPERATURE, value: true },
              { type: TYPE.HUMID, value: true },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: true },
              { type: TYPE.NO2, value: true },
              { type: TYPE.O3, value: false },
              { type: TYPE.TEMPERATURE, value: true },
              { type: TYPE.HUMID, value: false },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: false },
              { type: TYPE.NO2, value: true },
              { type: TYPE.O3, value: true },
              { type: TYPE.TEMPERATURE, value: true },
              { type: TYPE.HUMID, value: true },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: true },
              { type: TYPE.NO2, value: true },
              { type: TYPE.O3, value: true },
              { type: TYPE.TEMPERATURE, value: false },
              { type: TYPE.HUMID, value: true },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: true },
              { type: TYPE.NO2, value: true },
              { type: TYPE.O3, value: false },
              { type: TYPE.TEMPERATURE, value: true },
              { type: TYPE.HUMID, value: true },
            ],
          },
        ],
      },
    };
  },
  props: {
    isPop: Boolean,
    togglePop: Function,
  },
  methods: {
    levelValidator(value) {
      if(value===true){
        return CODE.GOOD;
      }else if(value===false){
        return CODE.WORSE;
      }
    },
  },
};
</script>