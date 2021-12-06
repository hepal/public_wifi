<template>
  <div class="home">
    <MapCanvas v-bind:sensorList="sensorList" ref="mapCanvas">      
    </MapCanvas>
    <IndicatorContainer>
      <CardIndicator
        v-on:requestSensorData="getSensorData"
        v-for="indicator in indicatorListDummy"
        :sensoeId="indicator.id"
        :key="indicator.id"
        :title="indicator.title"
        :img="indicator.img"
        :value="indicator.value"
        :unit="indicator.unit"
      />
    </IndicatorContainer>
    <AlarmListContainer>
      <WarnAlarmList
        v-for="alarm in alarmListDummy"
        :key="alarm.id"
        :type="alarm.type"
        :level="alarm.level"
        :date="alarm.date"
        :img="alarm.img"
      />
    </AlarmListContainer>
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
import WarnAlarmList from '../components/AlarmList/WarnAlarmList/WarnAlarmList'

// assets
import ic_dust from "../assets/icon/indicator/dust.svg";
import ic_humid from "../assets/icon/indicator/humid.svg";
import ic_no2 from "../assets/icon/indicator/no2.svg";
import ic_o3 from "../assets/icon/indicator/o3.svg";
import ic_temp from "../assets/icon/indicator/temp.svg";

var jsonData = {
  requestSensorData : {
    beginYear: 2021,
    beginMonth: 12,
    beginDay: 6,
    endYear: 2021,
    endMonth: 12,
    endDay: 6
  }
};

var sensorMap = new HashMap();
var sensorList = [];

//sensor 값을 가져온다.
function requestData(home) {
  axios.post('https://cors-anywhere.herokuapp.com/http://210.90.145.70:12000/Sensor',JSON.stringify(jsonData),
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

          home.$refs.mapCanvas.updateSensors(sensorList);
        }
      });      
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

const IndicatorContainer = styled.div`
  position: fixed;
  display: flex;
  left: 144px;
  bottom: 24px;
  width: 100%;
`;

const AlarmListContainer = styled.div`
  position: absolute;
  top: 96px;
  right: 12px;
`;

export default {
  name: "Home",
  components: {
    MapCanvas,
    IndicatorContainer,
    CardIndicator,
    AlarmListContainer,
    WarnAlarmList
  },
  methods: {
    getSensorData() {
      requestData(this)
    },
  },
  data() {
    return {
      sensorList : sensorList,
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
