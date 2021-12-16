<template>
  <div class="home">
    <NavInteractive
      :setCurrentScreen="setCurrentScreen"
      :currentScreen="currentScreen"
    />
    {{ currentScreen }}
    <!-- 맵 캔버스 -->

    <MapCanvas ref="mapCanvas"> </MapCanvas>
    <!-- 버스 루트정보 FAB -->
    <ButtonToggleRoute v-on:click="isRoutePop = !isRoutePop">
      <img :src="ic_route" alt="" />
    </ButtonToggleRoute>
    <!-- 버스 루트 슬라이드 -->
    <BusRouteSlide :isPop="isRoutePop" :togglePop="togglePop" />
    <!-- 주요 기상정보 지표 컨테이너 -->
    <IndicatorContainer>
      <CardIndicator
        v-on:requestSensorData="getRouteData"
        v-for="(indicator, index) in indicatorListDummy"
        :sensoeId="indicator.id"
        :key="index"
        :title="indicator.title"
        :img="indicator.img"
        :value="indicator.value"
        :unit="indicator.unit"
      />
    </IndicatorContainer>
    <!-- 경보 알람리스트 정보 영역 -->
    <AlarmListContainer>
      <WarnAlarmList
        v-for="(alarm, index) in alarmListDummy"
        :key="index"
        :type="alarm.type"
        :level="alarm.level"
        :date="alarm.date"
        :img="alarm.img"
      />
    </AlarmListContainer>
    <!-- 스크린 -->
    <ScreenContainer v-if="currentScreen === 'STATISTIC'">
      <Statistic />
    </ScreenContainer>
    <ScreenContainer v-if="currentScreen === 'SETTING'">
      <Setting />
    </ScreenContainer>
    <ScreenContainer v-if="currentScreen === 'USERMANAGING'">
      <ManageUser />
    </ScreenContainer>
    <!-- 모달 -->
    <Test>
      <button v-on:click="toggleAlertPop">상황전파 발생 테스트</button>
    </Test>
    <AlertNoticeModal
      v-if="isAlertNoticePop"
      :onClose="toggleAlertPop"
      :onNext="toggleSubmitMsgPop"
    />
    <SubmitMsgModal v-if="isSubmitMsgPop" :onClose="toggleSubmitMsgPop" />
  </div>
</template>
<script>
window.CESIUM_BASE_URL = "../../cesium";

import axios from "axios";
import HashMap from "hashmap";

// @ is an alias to /src
import styled from "vue-styled-components";
import NavInteractive from "@/components/Nav/NavInteractive";
import MapCanvas from "../components/MapCanvas/MapCanvas";
import Statistic from "@/views/Statistic";
import Setting from "@/views/Setting";
import ManageUser from "@/views/ManageUser";
import CardIndicator from "../components/Card/CardIndicator/CardIndicator";
import WarnAlarmList from "../components/AlarmList/WarnAlarmList/WarnAlarmList";
import BusRouteSlide from "../components/slide/BusRouteSlide/BusRouteSlide";

// Modal
import AlertNoticeModal from "@/components/Modal/AlertNoticeModal/AlertNoticeModal";
import SubmitMsgModal from "@/components/Modal/SubmitMsgModal/SubmitMsgModal";

// assets
import ic_dust from "../assets/icon/indicator/dust.svg";
import ic_humid from "../assets/icon/indicator/humid.svg";
import ic_no2 from "../assets/icon/indicator/no2.svg";
import ic_o3 from "../assets/icon/indicator/o3.svg";
import ic_temp from "../assets/icon/indicator/temp.svg";

//센서-버스 매칭
import sensor_bus from "../assets/route/sensor_bus.json";

var jsonBusData = {
  requestSensorData: {
    beginYear: 2021,
    beginMonth: 12,
    beginDay: 7,
    endYear: 2021,
    endMonth: 12,
    endDay: 7,
  },
};

var sensorMap = new HashMap();
var routeMap = new HashMap();
var sensorList = [];
var mapCanvas = null;

var sensorAvgValues = {
  dust: 23,
  no2: 0.012,
  o3: 23,
  temp: 31,
  humid: 35,
};

//route 값을 가져온다.
function requestRouteData(home) {
  if (
    null != mapCanvas.$refs.mapCanvas ||
    undefined != mapCanvas.$refs.mapCanvas
  ) {
    mapCanvas.$refs.mapCanvas.updateRoute();
  }
}

//sensor 값을 가져온다.
function requestData(home) {
  var date = new Date();

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

  //axios.post('http://210.90.145.70:12000/Sensor',JSON.stringify(jsonBusData),
  axios
    .post("/Sensor", JSON.stringify(jsonBusData), {
      headers: { "Content-Type": "application/json" },
    })
    .then(function (response) {
      if (response.status == 200) {
        sensorMap.clear();
        console.log(response);

        let totalSensorList = [];

        //response.data.sensorDatas.reverse(); //최신 날짜부터 정렬을 위해 뒤집는다.
        for (let i of response.data.sensorDatas) {
          //console.log("%f,%f",i.lat,i.lon);
          if (30 < i.lat && i.lat < 40 && 120 < i.lon && i.lon < 130) {
            sensorMap.set(i.serno, i);
            totalSensorList.push(i);
          }
        }

        let tempSensorList = [];
        sensorMap.forEach(function (value, key) {
          console.log("%s,%s,%f,%f", key, value.regdate, value.lat, value.lon);
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

            //console.log("노선:%d 버스:%d 센서ID:%s 먼지:%f 이산화질소:%f 오존:%f 온도:%f 습도:%f 위도:%f 경도:%f",busInfo.routeNum,busInfo.busNum,sensor.serno,sensor.pm2_5,sensor.no2,sensor.o3,sensor.temp,sensor.humi,sensor.lat,sensor.lon);
          } else {
            console.log("%s 센서가 연계된 버스 없음", sensor.serno);
          }
        }

        if (sensorList.length > 0) {
          mapCanvas.indicatorListDummy[0].value = roundToTwo(
            tsa.dust / sensorList.length
          );
          mapCanvas.indicatorListDummy[1].value = roundToTwo(
            tsa.no2 / sensorList.length
          );
          mapCanvas.indicatorListDummy[2].value = roundToTwo(
            tsa.o3 / sensorList.length
          );
          mapCanvas.indicatorListDummy[3].value = roundToTwo(
            tsa.temp / sensorList.length
          );
          mapCanvas.indicatorListDummy[4].value = roundToTwo(
            tsa.humid / sensorList.length
          );

          // sensorAvgValues.dust = tsa.dust / sensorList.length;
          // sensorAvgValues.no2 = tsa.no2 / sensorList.length;
          // sensorAvgValues.o3 = tsa.o3 / sensorList.length;
          // sensorAvgValues.temp = tsa.temp / sensorList.length;
          // sensorAvgValues.humid = tsa.humid / sensorList.length;

          //sensorAvgValues = tsa;
        }

        if (
          null != mapCanvas.$refs.mapCanvas ||
          undefined != mapCanvas.$refs.mapCanvas
        ) {
          mapCanvas.$refs.mapCanvas.updateSensors(activeSensorList);
          mapCanvas.$refs.mapCanvas.updateRoute(totalSensorList);
        }
      }
    });
}

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

//선과 점과의 거리를 구한다.
function pDistance(x, y, x1, y1, x2, y2) {
  var A = x - x1;
  var B = y - y1;
  var C = x2 - x1;
  var D = y2 - y1;

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0)
    //in case of 0 length line
    param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  var dx = x - xx;
  var dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

import ic_route from "../assets/icon/route_detail/off.svg";

const ScreenContainer = styled.div`
  position: fixed;
  z-index: 9;
  width: 100%;
  height: 100%;
  background-color: #fff;
  top: 0;
  left: 0;
`;

const IndicatorContainer = styled.div`
  position: fixed;
  display: flex;
  left: 124px;
  bottom: 24px;
  width: 100%;
  z-index: 9;
  @media only screen and (max-width: 480px) {
    left: 0px;
    bottom: 12px;
    justify-content: space-between;
  }
`;

const AlarmListContainer = styled.div`
  position: absolute;
  top: 80px;
  right: 12px;
  z-index: 9;
  @media only screen and (max-width: 480px) {
    display: none;
  }
`;

const ButtonToggleRoute = styled.button`
  position: fixed;
  border: none;
  outline: none;
  z-index: 9;
  top: 80px;
  left: 124px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 16px;
  ${(props) => props.theme.layout.flexColCenter}
  background-color: #fff;
  img {
    width: 24px;
    height: 24px;
  }
  @media only screen and (max-width: 480px) {
    left: 16px;
    top: 16px;
  }
`;

const Test = styled.div`
  position: absolute;
  top: 200px;
  left: 600px;
  z-index: 4;
  button {
    width: 400px;
    height: 80px;
    background-color: #cc1122;
    color: #fff;
    font-size: 24px;
  }
  @media only screen and (max-width: 480px) {
    display: none;
  }
`;

export default {
  name: "Home",
  components: {
    MapCanvas,
    Statistic,
    Setting,
    ManageUser,
    IndicatorContainer,
    ScreenContainer,
    CardIndicator,
    AlarmListContainer,
    ButtonToggleRoute,
    WarnAlarmList,
    BusRouteSlide,
    AlertNoticeModal,
    Test,
    SubmitMsgModal,
    NavInteractive,
  },
   created: function () {
    mapCanvas = this;

    setInterval(function () {
      requestData(this);
      console.log("request bus data");
    }, 10000);
  },
  methods: {
    togglePop() {
      this.isRoutePop = !this.isRoutePop;
    },
    toggleAlertPop() {
      this.isAlertNoticePop = !this.isAlertNoticePop;
    },
    toggleSubmitMsgPop() {
      this.isAlertNoticePop = false;
      this.isSubmitMsgPop = !this.isSubmitMsgPop;
    },
    getSensorData() {
      requestData(this);
    },
    getRouteData() {
      requestRouteData(this);
    },
    setCurrentScreen(screenName) {
      this.currentScreen = screenName;
    },
  }, 
  data() {
    return {
      // 라우터 대신 사용할 현재 화면 값
      // MAP, STATISTIC, SETTING, USERMANAGING
      currentScreen: "MAP",
      sensorList: sensorList,
      // IMG
      ic_route,
      // STATE,
      isRoutePop: false,
      // 주의보 발령 팝업
      isAlertNoticePop: false,
      // 상황전파 팝업
      isSubmitMsgPop: false,
      // DATA DUMMY
      indicatorListDummy: [
        {
          id: "dust",
          title: "초미세먼지",
          unit: "㎍/㎥",
          value: sensorAvgValues.dust,
          img: ic_dust,
          isSelected: false,
        },
        {
          id: "no2",
          title: "이산화질소(NO2)",
          unit: "ppm",
          value: sensorAvgValues.no2,
          img: ic_no2,
          isSelected: false,
        },
        {
          id: "o3",
          title: "오존(O3)",
          unit: "ppm",
          value: sensorAvgValues.o3,
          img: ic_o3,
          isSelected: false,
        },
        {
          id: "temp",
          title: "온도",
          unit: "°C",
          value: sensorAvgValues.temp,
          img: ic_temp,
          isSelected: false,
        },
        {
          id: "humid",
          title: "습도",
          unit: "%",
          value: sensorAvgValues.humid,
          img: ic_humid,
          isSelected: false,
        },
      ],
      alarmListDummy: [
        {
          id: "dust",
          title: "초미세먼지 주의보 발령",
          type: "초미세먼지",
          img: ic_dust,
          level: "주의보",
          date: "20221-11-12  |  3:15:21pm",
        },
        {
          id: "dust",
          title: "초미세먼지 주의보 발령",
          type: "폭염",
          img: ic_temp,
          level: "주의보",
          date: "20221-11-12  |  3:15:21pm",
        },
        {
          id: "dust",
          title: "오존 주의보 발령",
          type: "오존",
          img: ic_o3,
          level: "주의보",
          date: "20221-11-12  |  3:15:21pm",
        },
        {
          id: "dust",
          title: "초미세먼지 주의보 발령",
          type: "초미세먼지",
          img: ic_dust,
          level: "주의보",
          date: "20221-11-12  |  3:15:21pm",
        },
      ],
    };
  },
};
</script>
