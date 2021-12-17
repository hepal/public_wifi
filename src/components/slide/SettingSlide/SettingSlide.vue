<template>
  <Container :isPop="true">
    <!-- <button v-on:click="togglePop" class="close">✕</button> -->
    <h3>센서 연결 상태</h3>
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
import axios from "axios";
import HashMap from "hashmap";

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
  table {
    margin-bottom: 0px !important;
  }
  td,
  th,
  tr {
    padding: 0px !important;
    text-align: center !important;
  }
`;

//센서-버스 매칭
import sensor_bus from "../../../assets/route/sensor_bus.json";

var sensorMap = new HashMap();
var sensorList = [];
var routeSlide = null;
var checkedRouteNumbers = [];

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

function requestSensorState() {
  let date = new Date(); //현재 시간

  let jsonBusData = {
    requestSensorData: {
      beginYear: date.getFullYear(),
      beginMonth: date.getMonth() + 1,
      beginDay: date.getDate(),
      beginHour: Math.max(0,date.getHours()-2),
      endYear: date.getFullYear(),
      endMonth: date.getMonth() + 1,
      endDay: date.getDate(),
      endHour: date.getHours() ,
    },
  };

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
          console.log("%s,%s,%f,%f", key, value.regdate, value.lat, value.lon);
          tempSensorList.push(value);
        });

        sensorList = tempSensorList;

        let activeSensorList = [];
        for (let sensor of sensorList) {
          let busInfo = getBusInfo(sensor.serno);

          if (null != busInfo) {
            let activeSensor = {
              sensorInfo: sensor,
              busInfo: busInfo,
            };

            activeSensorList.push(activeSensor);
          } else {
            console.log("%s 센서가 연계된 버스 없음", sensor.serno);
          }
        }

        let dataList = [];
        let selectAll = false;

        for (let c of checkedRouteNumbers) {
          if (c == "모두 선택") {
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

          let ymd = sensorInfo.regdate.split(" ")[0].split("-");

          let year = parseInt(ymd[0]);
          let month = parseInt(ymd[1]);
          let day = parseInt(ymd[2]);
          
          let hms = sensorInfo.regdate.split(" ")[1].split(":");

          let hour = parseInt(hms[0]);
          let min = parseInt(hms[1]);
          let sec = parseInt(hms[2]);

          let sensorDate = new Date(year,month-1,day,hour,min,sec); //month는 0~11
          
          let currentTime = Date.now(); //밀리세컨드
          let sensorTime = sensorDate.getTime(); //밀리세컨드

          let timeDiff = ((currentTime - sensorTime) / 1000 / 60); //분으로 전환

          //5분이상 지연이면

          let sensorOk = true;

          if(timeDiff > 5)  {
            sensorOk = false;
          }
          

          let busData = {
            busNumber: format("{0}({1})", busInfo.busNum, busInfo.routeNum),

            data: [
              { type: TYPE.DUST, value: sensorOk },
              { type: TYPE.NO2, value: sensorOk },
              { type: TYPE.O3, value: sensorOk },
              { type: TYPE.TEMPERATURE, value: sensorOk },
              { type: TYPE.HUMID, value: sensorOk },
            ],

            // data: [
            //   { type: TYPE.DUST, value: sensorInfo.pm2_5 },
            //   { type: TYPE.NO2, value: roundToTwo(sensorInfo.no2 / 1000)},
            //   { type: TYPE.O3, value: sensorInfo.o3 },
            //   { type: TYPE.TEMPERATURE, value: sensorInfo.temp },
            //   { type: TYPE.HUMID, value: sensorInfo.humi },
            // ],
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
}

function updateSensorState(activeSensorList) {
  let date = new Date(); //현재 시간

  console.log("setting slide update");
}

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
  created() {
    routeSlide = this;
    checkedRouteNumbers.push("모두 선택");    
  },
  watch: {
    checkedNames: function (val) {
      checkedRouteNumbers = [];

      for (let v of val) {
        checkedRouteNumbers.push(v.replace("번", ""));
      }

      requestSensorState();
    },
  },
  mounted() {
    console.log("setting slide mounted");
    this.$nextTick(function () {
      // 모든 화면이 렌더링된 후 실행합니다.
      requestSensorState();
    });
  },
  destroyed() {
    console.log("setting slide destroyed");
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
      if (value === true) {
        return CODE.GOOD;
      } else if (value === false) {
        return CODE.WORSE;
      }
    },
  },
};
</script>
