<template>
  <div class="home">
    <MapCanvas ref="mapCanvas">      
    </MapCanvas>    
    <!-- 맵 캔버스 -->
    <MapCanvas />
    <!-- 버르 루트정보 FAB -->
    <ButtonToggleRoute
      v-on:click="isRoutePop = !isRoutePop"
    >
      <img :src="ic_route" alt='' />
    </ButtonToggleRoute>
    <!-- 버스 루트 슬라이드 -->
    <BusRouteSlide
      :isPop="isRoutePop"
      :togglePop="togglePop"
    />
    <!-- 주요 기상정보 지표 컨테이너 -->
    <IndicatorContainer>
      <CardIndicator
        v-on:requestSensorData="getSensorData"
        v-for="(indicator,index) in indicatorListDummy"
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
    <!-- 모달 -->
    <Test>
      <button v-on:click="toggleAlertPop">
        상황전파 발생 테스트
      </button>
    </Test>
    <AlertNoticeModal
      v-if="isAlertNoticePop"
      :onClose="toggleAlertPop"
      :onNext="toggleSubmitMsgPop"
    />
    <SubmitMsgModal
      v-if="isSubmitMsgPop"
      :onClose="toggleSubmitMsgPop"
    />
  </div>
</template>
<script>
window.CESIUM_BASE_URL = '../../cesium';

import axios from 'axios';
import HashMap from 'hashmap';


// @ is an alias to /src
import styled from "vue-styled-components";
import MapCanvas from "../components/MapCanvas/MapCanvas";
import CardIndicator from "../components/Card/CardIndicator/CardIndicator";
import WarnAlarmList from '../components/AlarmList/WarnAlarmList/WarnAlarmList';
import BusRouteSlide from "../components/slide/BusRouteSlide/BusRouteSlide";

// Modal
import AlertNoticeModal from '@/components/Modal/AlertNoticeModal/AlertNoticeModal';
import SubmitMsgModal from '@/components/Modal/SubmitMsgModal/SubmitMsgModal';

// assets
import ic_dust from "../assets/icon/indicator/dust.svg";
import ic_humid from "../assets/icon/indicator/humid.svg";
import ic_no2 from "../assets/icon/indicator/no2.svg";
import ic_o3 from "../assets/icon/indicator/o3.svg";
import ic_temp from "../assets/icon/indicator/temp.svg";

//센서-버스 매칭
import sensor_bus from '../assets/route/sensor_bus.json'

var jsonBusData = {
  requestSensorData : {
    beginYear: 2021,
    beginMonth: 12,
    beginDay: 7,
    endYear: 2021,
    endMonth: 12,
    endDay: 7
  }
};

var sensorMap = new HashMap();
var sensorList = [];

//sensor 값을 가져온다.
function requestData(home) {

  var date = new Date();

  jsonBusData.beginYear = date.getFullYear();
  jsonBusData.beginMonth = date.getMonth() + 1; //0~11
  jsonBusData.beginDay = date.getDate();
  jsonBusData.endYear = jsonBusData.beginYear;
  jsonBusData.endMonth = jsonBusData.beginMonth;
  jsonBusData.endDay = jsonBusData.beginDay;

  //axios.post('http://210.90.145.70:12000/Sensor',JSON.stringify(jsonBusData),
  axios.post('/Sensor',JSON.stringify(jsonBusData),
      {headers: { 'Content-Type': 'application/json'} })
      .then(function(response) {
        if(response.status == 200) {
          sensorMap.clear();
          console.log(response);
          //response.data.sensorDatas.reverse(); //최신 날짜부터 정렬을 위해 뒤집는다.
          for(let i of response.data.sensorDatas) {
            //console.log("%f,%f",i.lat,i.lon);
            if( 30 <i.lat && i.lat < 40 && 120 < i.lon && i.lon < 130) {
              sensorMap.set(i.serno,i);
            }
          }

          let tempSensorList = [];
          sensorMap.forEach(function(value,key) {
            console.log("%s,%s,%f,%f",key,value.regdate,value.lat,value.lon);
            tempSensorList.push(value);
          });

          sensorList = tempSensorList;

          for(let sensor of sensorList) {
            let busInfo = getBusInfo(sensor.serno);

            if(null != busInfo) {
              console.log(busInfo);
            } else {
              console.log("%s not exist",sensor.serno);
            }
          }

          mapCanvas.$refs.mapCanvas.updateSensors(sensorList);
        }
      });      
}

var mapCanvas = null;

function getBusInfo(sensorId) {
  for(let busInfo of sensor_bus) {
    if(sensorId == busInfo.SensorId) {
      let bus = {
        compName : busInfo.CompanyName,
        routeNum : busInfo.RouteNumber,
        busNum : busInfo.BusNumber
      }

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
  if (len_sq != 0) //in case of 0 length line
      param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  }
  else if (param > 1) {
    xx = x2;
    yy = y2;
  }
  else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  var dx = x - xx;
  var dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

import ic_route from "../assets/icon/route_detail/off.svg";


const IndicatorContainer = styled.div`
  position: fixed;
  display: flex;
  left: 124px;
  bottom: 24px;
  width: 100%;
  z-index: 9;
`;

const AlarmListContainer = styled.div`
  position: absolute;
  top: 80px;
  right: 12px;
  z-index: 9;
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
  box-shadow: rgba(0,0,0,0.08) 0px 0px 16px;
  ${props => props.theme.layout.flexColCenter}
  background-color: #fff;
  img{
    width: 24px;
    height: 24px;
  }
;`

const Test = styled.div`
  position: absolute;
  top: 200px;
  left: 600px;
  z-index: 4;
  button{
    width: 400px;
    height: 80px;
    background-color: #cc1122;
    color: #fff;
    font-size: 24px;
  }
`;

export default {
  name: "Home",
  components: {
    MapCanvas,
    IndicatorContainer,
    CardIndicator,
    AlarmListContainer,
    ButtonToggleRoute,
    WarnAlarmList,
    BusRouteSlide,
    AlertNoticeModal,
    Test,
    SubmitMsgModal
  },
  methods:{
    togglePop (){
      this.isRoutePop = !this.isRoutePop;
    },
    toggleAlertPop (){
      this.isAlertNoticePop = !this.isAlertNoticePop;
    },
    toggleSubmitMsgPop (){
      this.isAlertNoticePop = false;
      this.isSubmitMsgPop = !this.isSubmitMsgPop;
    },
    getSensorData() {
      requestData(this)
    },
  },  
  created: function() {
    mapCanvas = this;

    // setInterval(function() {
    //   requestData(this)
    //   console.log("request bus data");
    // },10000)
  }, 
  data() {
    return {
      sensorList : sensorList,
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
          value: 23,
          img: ic_dust,
          isSelected: false,
        },
        {
          id: "no2",
          title: "이산화질소(NO2)",
          unit: "ppm",
          value: 0.012,
          img: ic_no2,
          isSelected: false,
        },
        {
          id: "o3",
          title: "오존(O3)",
          unit: "ppm",
          value: 23,
          img: ic_o3,
          isSelected: false,
        },
        {
          id: "temp",
          title: "온도",
          unit: "°C",
          value: 31,
          img: ic_temp,
          isSelected: false,
        },
        {
          id: "humid",
          title: "습도",
          unit: "%",
          value: 23,
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
          date: "20221-11-12  |  3:15:21pm"
        },
         {
          id: "dust",
          title: "초미세먼지 주의보 발령",
          type: "폭염",
          img: ic_temp,
          level: "주의보",
          date: "20221-11-12  |  3:15:21pm"
        },
         {
          id: "dust",
          title: "오존 주의보 발령",
          type: "오존",
          img: ic_o3,
          level: "주의보",
          date: "20221-11-12  |  3:15:21pm"
        },
         {
          id: "dust",
          title: "초미세먼지 주의보 발령",
          type: "초미세먼지",
          img: ic_dust,
          level: "주의보",
          date: "20221-11-12  |  3:15:21pm"
        },
      ]
    };
  },
};
</script>
