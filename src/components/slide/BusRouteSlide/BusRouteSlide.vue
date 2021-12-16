<template>
  <Container :isPop="isPop">
    <Section ref="top">
      <button v-on:click="togglePop" class="close">✕</button>
      <h3>버스 노선 현황 정보</h3>
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
      <MeasureTime>
        <div>
          측정시간: <span>{{ measureTime }}</span>
        </div>
        <button v-on:click="requestBusData()">
          <img :src="ic_refrsh" alt="" />
        </button>
      </MeasureTime>
    </Section>
    <TableSection :topHeight="topHeight" :bottomHeight="bottomHeight">
      <KeyIndicatorTable :tableData="routeDataDummyList" />
    </TableSection>
    <Section ref="bottom">
      <LegendIndicator />
    </Section>
  </Container>
</template>
<script>
import styled from "vue-styled-components";
import { TYPE, CODE, SCALE } from "../../../globalConst/indicatorCode";
import KeyIndicatorTable from "@/components/table/KeyIndicatorTable/KeyIndicatorTable";
import LegendIndicator from "@/components/table/KeyIndicatorTable/LegendIndicator";
import axios from "axios";
import HashMap from "hashmap";

// Assets
import ic_refrsh from "../../../assets/icon/action/refresh.svg";
//센서-버스 매칭
import sensor_bus from "../../../assets/route/sensor_bus.json";

var sensorMap = new HashMap();
var sensorList = [];
var routeSlide = null;
var checkedRouteNumbers = [];

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
  @media only screen and (max-width: 480px) {
    padding-top: 32px;
    left: ${(props) => (props.isPop ? "0px" : "-728px")};
    width: calc(100% - 32px);
    padding: 16px;
    overflow-y: overlay;
    button.close {
      top: 12px;
      right: 12px;
    }
  }
`;

const Section = styled.div`
  width: 100%;
`;

const MeasureTime = styled.div`
  width: 100%;
  height: 48px;
  /* justify-content: space-between; */
  display: flex;
  align-items: center;
  span {
    margin-left: 8px;
    margin-right: 16px;
  }
  button {
    width: 32px;
    height: 32px;
    /* border-radius: 50%; */
    background-color: #fff;
    outline: none;
    border: none;
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
  @media only screen and (max-width: 480px) {
    width: 33%;
  }
`;

const TableSectioProps = {
  topHeight: String,
  bottomHeight: String,
};

const TableSection = styled("div", TableSectioProps)`
  width: 100%;
  height: ${(props) =>
    `calc(100% - ${props.topHeight} - ${props.bottomHeight} - 96px - 24px - 24px)`};
  overflow-y: auto;
  table {
    margin-bottom: 48px;
  }
  td,
  th,
  tr {
    padding: 0px !important;
    text-align: center !important;
  }
  @media only screen and (max-width: 480px) {
    height: 480px;
  }
`;

function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

function getBusInfo(sensorId) {
  for (let busInfo of sensor_bus) {
    if (sensorId == busInfo.SensorId) {
      let bus = {
        compName: busInfo.CompanyName,
        routeNum: busInfo.RouteNumber,
        busNum: busInfo.BusNumber,
      };

      return bus;
    }
  }

  return null;
}

function format() {
  var args = Array.prototype.slice.call(arguments, 1);
  return arguments[0].replace(/\{(\d+)\}/g, function (match, index) {
    return args[index];
  });
}

export default {
  name: "BusRouteSlide",
  components: {
    Container,
    Section,
    MeasureTime,
    SectionRow,
    TableSection,
    KeyIndicatorTable,
    LegendIndicator,
    CheckContainer,
  },
  created() {
    routeSlide = this;
    checkedRouteNumbers.push("모두 선택");
  },
  mounted() {
    console.log(this.$refs.top.$el.clientHeight);
    this.topHeight = this.$refs.top.$el.clientHeight + "px";
    this.bottomHeight = this.$refs.bottom.$el.clientHeight + "px";
  },
  data() {
    return {
      CODE,
      SCALE,
      TYPE,
      ic_refrsh,
      checkedNames: ["모두 선택"],
      measureTime: "2021-10-21  13:11:29",
      topHeight: null,
      bottomHeight: null,
      busRouteList: [
        {
          number: "모두 선택",
          value: -1,
          isCheck: true,
        },
        {
          number: "240번",
          value: 240,
          isCheck: false,
        },
        {
          number: "425번",
          value: 425,
          isCheck: false,
        },
        {
          number: "503번",
          value: 503,
          isCheck: false,
        },
        {
          number: "523번",
          value: 523,
          isCheck: false,
        },
        {
          number: "623번",
          value: 623,
          isCheck: false,
        },
        {
          number: "724번",
          value: 724,
          isCheck: false,
        },
        {
          number: "730번",
          value: 730,
          isCheck: false,
        },
        {
          number: "805번",
          value: 805,
          isCheck: false,
        },
        {
          number: "937번",
          value: 937,
          isCheck: false,
        },
      ],
      routeDataDummyList: {
        header: [
          "차량번호(노선번호)\n ",
          "초미세먼지\n(㎍/㎥)",
          "이산화질소\n(ppm)",
          "오존\n(ppm)",
          "온도\n(°C)",
          "습도\n(%)",
        ],
        data: [
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: 23.0 },
              { type: TYPE.NO2, value: 0.012 },
              { type: TYPE.O3, value: 0.0031 },
              { type: TYPE.TEMPERATURE, value: 35.6 },
              { type: TYPE.HUMID, value: 65.0 },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: 15.0 },
              { type: TYPE.NO2, value: 0.003 },
              { type: TYPE.O3, value: 0.0001 },
              { type: TYPE.TEMPERATURE, value: 35.2 },
              { type: TYPE.HUMID, value: 65.0 },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: 13.0 },
              { type: TYPE.NO2, value: 0.009 },
              { type: TYPE.O3, value: 0.0023 },
              { type: TYPE.TEMPERATURE, value: 35.0 },
              { type: TYPE.HUMID, value: 65.0 },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: 50.0 },
              { type: TYPE.NO2, value: 0.012 },
              { type: TYPE.O3, value: 0.0031 },
              { type: TYPE.TEMPERATURE, value: 29.0 },
              { type: TYPE.HUMID, value: 43.0 },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: 65.0 },
              { type: TYPE.NO2, value: 0.009 },
              { type: TYPE.O3, value: 0.0031 },
              { type: TYPE.TEMPERATURE, value: 32.0 },
              { type: TYPE.HUMID, value: 12.0 },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: 25.0 },
              { type: TYPE.NO2, value: 0.019 },
              { type: TYPE.O3, value: 0.0031 },
              { type: TYPE.TEMPERATURE, value: 34.0 },
              { type: TYPE.HUMID, value: 23.0 },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: 8.0 },
              { type: TYPE.NO2, value: 0.0017 },
              { type: TYPE.O3, value: 0.0031 },
              { type: TYPE.TEMPERATURE, value: 35.6 },
              { type: TYPE.HUMID, value: 89.0 },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: 45.0 },
              { type: TYPE.NO2, value: 0.011 },
              { type: TYPE.O3, value: 0.0031 },
              { type: TYPE.TEMPERATURE, value: 35.0 },
              { type: TYPE.HUMID, value: 45.0 },
            ],
          },
          {
            busNumber: "5070",
            data: [
              { type: TYPE.DUST, value: 12.0 },
              { type: TYPE.NO2, value: 0.009 },
              { type: TYPE.O3, value: 0.0031 },
              { type: TYPE.TEMPERATURE, value: 35.0 },
              { type: TYPE.HUMID, value: 12.0 },
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
  watch: {
    checkedNames: function(val) {
      checkedRouteNumbers = [];

      for(let v of val) {
        checkedRouteNumbers.push(v.replace('번',''));
      }      
    }
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
    requestBusData() {
      let date = new Date();

      let jsonBusData = {
        requestSensorData: {
          beginYear: date.getFullYear(),
          beginMonth: date.getMonth() + 1,
          beginDay: date.getDate(),
          beginHour: date.getHours(),
          endYear: date.getFullYear(),
          endMonth: date.getMonth() + 1,
          endDay: date.getDate(),
          endHour: date.getHours(),
        },
      };

      console.log("request bus data");
      axios
        .post("/Sensor", JSON.stringify(jsonBusData), {
          headers: { "Content-Type": "application/json" },
        })
        .then(function (response) {
          if (response.status == 200) {
            sensorMap.clear();
            console.log(response);

            for (let i of response.data.sensorDatas) {
              if (30 < i.lat && i.lat < 40 && 120 < i.lon && i.lon < 130) {
                sensorMap.set(i.serno, i);
              }
            }

            let tempSensorList = [];
            sensorMap.forEach(function (value, key) {
              console.log(
                "%s,%s,%f,%f",
                key,
                value.regdate,
                value.lat,
                value.lon
              );
              tempSensorList.push(value);
            });

            sensorList = tempSensorList;

            let tsa = {
              dust: 0,
              no2: 0,
              o3: 0,
              temp: 0,
              humid: 0,
            };

            let activeSensorList = [];
            for (let sensor of sensorList) {
              let busInfo = getBusInfo(sensor.serno);

              tsa.dust += sensor.pm2_5;
              tsa.no2 += sensor.no2;
              tsa.o3 += sensor.o3;
              tsa.temp += sensor.temp;
              tsa.humid += sensor.humi;

              if (null != busInfo) {
                let activeSensor = {
                  sensorInfo: sensor,
                  busInfo: busInfo,
                };

                activeSensorList.push(activeSensor);

                console.log(
                  "노선:%d 버스:%d 센서ID:%s 먼지:%f 이산화질소:%f 오존:%f 온도:%f 습도:%f 위도:%f 경도:%f",
                  busInfo.routeNum,
                  busInfo.busNum,
                  sensor.serno,
                  sensor.pm2_5,
                  sensor.no2,
                  sensor.o3,
                  sensor.temp,
                  sensor.humi,
                  sensor.lat,
                  sensor.lon
                );
              } else {
                console.log("%s 센서가 연계된 버스 없음", sensor.serno);
              }
            }

            let dataList = [];
            let selectAll = false;

            for (let c of checkedRouteNumbers) {
              if(c == "모두 선택") {
                selectAll = true;
                break;
              }
            }

            for (let i of activeSensorList) {
              let busInfo = i.busInfo;
              let sensorInfo = i.sensorInfo;

              let isChecked = false;             

              for (let c of checkedRouteNumbers) {
                if (parseInt(c) == busInfo.routeNum) {
                  isChecked = true;
                  break;
                }
              }

              let busData = {
                busNumber: format("{0}({1})", busInfo.busNum, busInfo.routeNum),
                data: [
                  { type: TYPE.DUST, value: sensorInfo.pm2_5 },
                  { type: TYPE.NO2, value: roundToTwo(sensorInfo.no2 / 1000)},
                  { type: TYPE.O3, value: sensorInfo.o3 },
                  { type: TYPE.TEMPERATURE, value: sensorInfo.temp },
                  { type: TYPE.HUMID, value: sensorInfo.humi },
                ],
              };

              if (isChecked || selectAll) {
                dataList.push(busData);
              }

              routeSlide.routeDataDummyList.data = dataList;

              let date = new Date();

              routeSlide.measureTime = format(
                "{0}년 {1}월 {2}일 {3}시 {4}분 {5}초",
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
              );
            }
          }
        });
    },
  },
};
</script>
