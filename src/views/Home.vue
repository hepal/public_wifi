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
        :isSelected="indicator.id === currentIndictor"
        :setCurretIndicator="setCurretIndicator"
        :id="indicator.id"
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
        :onDelete="
          () => {
            deleteAlarm(index);
          }
        "
      />
    </AlarmListContainer>
    <!-- 스크린 -->
    <ScreenContainer v-if="currentScreen === 'STATISTIC'">
      <Statistic />
    </ScreenContainer>
    <ScreenContainer
      ref="settingSlideContainer"
      v-if="currentScreen === 'SETTING'"
    >
      <Setting ref="settingSlide" />
    </ScreenContainer>
    <ScreenContainer v-if="currentScreen === 'USERMANAGING'">
      <ManageUser />
    </ScreenContainer>
    <ScreenContainer v-if="currentScreen === 'LOGIN'">
      <Login />
    </ScreenContainer>
    <!-- 모달 -->
    <Test>
      <button v-show="false" v-on:click="showAlertPop(true)">
        상황전파 발생 테스트
      </button>
    </Test>
    <AlertNoticeModal
      ref="alertNoticeModal"
      v-if="isAlertNoticePop"
      v-on:update="updateAlertNotice"
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
import sf from "sf";

// @ is an alias to /src
import styled from "vue-styled-components";
import NavInteractive from "@/components/Nav/NavInteractive";
import MapCanvas from "../components/MapCanvas/MapCanvas";
import Statistic from "@/views/Statistic";
import Setting from "@/views/Setting";
import ManageUser from "@/views/ManageUser";
import Login from "@/views/Sign";
import CardIndicator from "../components/Card/CardIndicator/CardIndicator";
import WarnAlarmList from "../components/AlarmList/WarnAlarmList/WarnAlarmList";
import BusRouteSlide from "../components/slide/BusRouteSlide/BusRouteSlide";
import { TYPE } from "../globalConst/indicatorCode";

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
var alertList = [];

var alertMap = new HashMap();

var sensorAvgValues = {
  dust: 23,
  no2: 0.012,
  o3: 23,
  temp: 31,
  humid: 35,
};

var component = null;

//route 값을 가져온다.
function requestRouteData(home, sensorType) {
  if (
    null != mapCanvas.$refs.mapCanvas ||
    undefined != mapCanvas.$refs.mapCanvas
  ) {
    mapCanvas.$refs.mapCanvas.setActiveSensor(sensorType);
  }
}

function requestAlarmtDataList(home, fullData) {
  let jsonAlertData = null;

  jsonAlertData = {
    requestSensorAlarm: {
      activeOnly: fullData,
    },
  };

  axios
    .post("http://210.90.145.70:12000/Sensor", JSON.stringify(jsonAlertData), {
      headers: { "Content-Type": "application/json" },
    })
    .then(function (response) {
      if (response.status == 200) {
        //alertMap.clear();

        for (let i of response.data.sensorAlarmList) {
          if (!alertMap.has(i.id)) {
            //신규 알람이 있으면 추가한다.
            alertMap.set(i.id, i);
            alertList.push(i);
          }
        }
      }

      if (alertList.length > 0) {
        mapCanvas.showAlertPop(true);
      }
    });
}

function compareStrings(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return (a < b) ? -1 : (a > b) ? 1 : 0;
}

//sensor 값을 가져온다.
function requestSensorDataList(home, fullData) {
  var date = new Date();

  let jsonBusData = null;

  if (fullData) {
    jsonBusData = {
      requestSensorData: {
        beginYear: date.getFullYear(),
        beginMonth: date.getMonth() + 1,
        beginDay: date.getDate(),
        //beginHour: date.getHours(),
        endYear: date.getFullYear(),
        endMonth: date.getMonth() + 1,
        endDay: date.getDate(),
        //endHour: date.getHours(),
      },
    };
  } else {
    jsonBusData = {
      requestSensorData: {
        beginYear: date.getFullYear(),
        beginMonth: date.getMonth() + 1,
        beginDay: date.getDate(),
        beginHour: Math.max(0, date.getHours() - 1),
        endYear: date.getFullYear(),
        endMonth: date.getMonth() + 1,
        endDay: date.getDate(),
        endHour: date.getHours(),
      },
    };
  }

  console.log(jsonBusData);

  axios
    .post("http://210.90.145.70:12000/Sensor", JSON.stringify(jsonBusData), {
      headers: { "Content-Type": "application/json" },
    })
    .then(function (response) {
      if (response.status == 200) {
        sensorMap.clear();
        console.log(response);

        let totalSensorList = [];

        //response.data.sensorDatas.reverse(); //최신 날짜부터 정렬을 위해 뒤집는다.
        response.data.sensorDatas.sort(function(a,b) {
          return compareStrings(a.regdate, b.regdate);
        });

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

        if (sensorList.length > 0 && fullData == false) {
          mapCanvas.indicatorListDummy[0].value = roundToTwo(
            tsa.dust / sensorList.length
          );
          mapCanvas.indicatorListDummy[1].value = roundToTwo(
            tsa.no2 / sensorList.length / 1000.0 //이산화질소는 1/1000 으로 줄여야 한다.
          );
          mapCanvas.indicatorListDummy[2].value = roundToTwo(
            tsa.o3 / sensorList.length / 1000.0 //오존은 1/1000 으로 줄여야 한다.
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
          if (!fullData) {
            mapCanvas.$refs.mapCanvas.updateSensors(activeSensorList);
          }

          //mapCanvas.$refs.settingSlide.updateSensorState(activeSensorList);

          if (fullData) {
            mapCanvas.$refs.mapCanvas.updateRoute(totalSensorList);
          }
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
    Login,
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

    //10초에 한번씩 호출 (버스 및 현재 데이터 업데이트)
    setInterval(function () {
      requestSensorDataList(this, false);
      console.log("request bus data");
    }, 10000); //10초에 1번

    setInterval(function () {
      requestAlarmtDataList(this, true);
      console.log("request alarm data");
    }, 5000); //5초에 1번
  },
  mounted: function () {
    component = this;
  },
  methods: {
    updateAlertNotice(alertComp) {
      //console.log(alertComp);

      if (alertList.length > 0) {
        let a = alertList.pop();

        let ymd = a.regdate.split(" ")[0].split("-");

        let year = parseInt(ymd[0]);
        let month = parseInt(ymd[1]);
        let day = parseInt(ymd[2]);

        let dayString = sf("{0}년 {1}월 {2}일", year, month, day);

        let hms = a.regdate.split(" ")[1].split(":");

        let hour = parseInt(hms[0]);
        let min = parseInt(hms[1]);
        let sec = parseInt(hms[2]);

        let hourString = sf("{0}시 {1}분 {2}초", hour, min, sec);

        let message = "";

        let sensorType = "";

        let alarmImage = null;

        switch (a.stype) {
          case "o3":
            sensorType = "오존";
            alarmImage = ic_o3;
            break;
          case "no2":
            sensorType = "이산화질소";
            alarmImage = ic_no2;
            break;
          case "humid":
            sensorType = "습도";
            alarmImage = ic_humid;
            break;
          case "pm2_5":
            sensorType = "초미세먼지";
            alarmImage = ic_dust;
            break;
          case "cold":
            sensorType = "한파";
            alarmImage = ic_temp;
            break;
          case "hot":
            sensorType = "폭염";
            alarmImage = ic_temp;
            break;
        }

        let alertType = "";

        if (a.atype == "watch") {
          //주의보
          alertType = "주의보";
        } else if (a.atype == "alert") {
          //경보
          alertType = "경보";
        }

        message = sf("{0} {1}가 발령되었습니다.", sensorType, alertType);

        //알람창에 내용 업데이트
        alertComp.setAlarmData(dayString, hourString, message);

        //오른쪽 경보 history 업데이트
        let alarmListData = {
          id: a.stype,
          title: sf("{0} {1} 발령", sensorType, alertType),
          type: sensorType,
          img: alarmImage,
          level: alertType,
          date: dayString + " " + hourString,
        };

        //       alarmListDummy: [
        // {
        //   id: "dust",
        //   title: "초미세먼지 주의보 발령",
        //   type: "초미세먼지",
        //   img: ic_dust,
        //   level: "주의보",
        //   date: "20221-11-12  |  3:15:21pm",
        // },

        mapCanvas.alarmListDummy.push(alarmListData);
      }
    },
    togglePop() {
      this.isRoutePop = !this.isRoutePop;
    },
    showAlertPop(show) {
      this.isAlertNoticePop = show;
    },
    toggleAlertPop() {
      this.isAlertNoticePop = !this.isAlertNoticePop;
    },
    toggleSubmitMsgPop() {
      this.isAlertNoticePop = false;
      this.isSubmitMsgPop = !this.isSubmitMsgPop;
    },
    getSensorData() {
      requestSensorDataList(this);
    },
    getRouteData(sensorType) {},
    setCurrentScreen(screenName) {
      this.currentScreen = screenName;
    },
    setCurretIndicator(code) {
      this.currentIndictor = code;
      //code를 json 호술시 사용하는 것으로 변경

      let jsonCode = "";

      switch (code) {
        case "dust":
          jsonCode = "pm2_5";
          break;
        case "humid":
          jsonCode = "humi";
          break;
        case "temperature":
          jsonCode = "temp";
          break;
        default:
          jsonCode = code;
      }

      requestRouteData(this, jsonCode);
      requestSensorDataList(this, true);
    },
    deleteAlarm(index) {
      this.alarmListDummy = this.alarmListDummy.filter((_, i) => i !== index);
    },
  },
  data() {
    return {
      TYPE,
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
      // CURRENT INDICATOR
      currentIndictor: TYPE.DUST,
      // DATA DUMMY
      indicatorListDummy: [
        {
          id: TYPE.DUST,
          title: "초미세먼지",
          unit: "㎍/㎥",
          value: sensorAvgValues.dust,
          img: ic_dust,
          isSelected: false,
        },
        {
          id: TYPE.NO2,
          title: "이산화질소(NO2)",
          unit: "ppm",
          value: sensorAvgValues.no2 / 1000,
          img: ic_no2,
          isSelected: false,
        },
        {
          id: TYPE.O3,
          title: "오존(O3)",
          unit: "ppm",
          value: sensorAvgValues.o3 / 1000,
          img: ic_o3,
          isSelected: false,
        },
        {
          id: TYPE.TEMPERATURE,
          title: "온도",
          unit: "°C",
          value: sensorAvgValues.temp,
          img: ic_temp,
          isSelected: false,
        },
        {
          id: TYPE.HUMID,
          title: "습도",
          unit: "%",
          value: sensorAvgValues.humid,
          img: ic_humid,
          isSelected: false,
        },
      ],
      alarmListDummy: [
        // {
        //   id: "dust",
        //   title: "초미세먼지 주의보 발령",
        //   type: "초미세먼지",
        //   img: ic_dust,
        //   level: "주의보",
        //   date: "20221-11-12  |  3:15:21pm",
        // },
        // {
        //   id: "dust",
        //   title: "초미세먼지 주의보 발령",
        //   type: "폭염",
        //   img: ic_temp,
        //   level: "주의보",
        //   date: "20221-11-12  |  3:15:21pm",
        // },
        // {
        //   id: "dust",
        //   title: "오존 주의보 발령",
        //   type: "오존",
        //   img: ic_o3,
        //   level: "주의보",
        //   date: "20221-11-12  |  3:15:21pm",
        // },
        // {
        //   id: "dust",
        //   title: "초미세먼지 주의보 발령",
        //   type: "초미세먼지",
        //   img: ic_dust,
        //   level: "주의보",
        //   date: "20221-11-12  |  3:15:21pm",
        // },
      ],
    };
  },
};
</script>
