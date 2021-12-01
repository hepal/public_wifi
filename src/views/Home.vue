<template>
  <div class="home">
    <MapCanvas />
    <IndicatorContainer>
      <CardIndicator
        v-for="indicator in indicatorListDummy"
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
  data() {
    return {
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
