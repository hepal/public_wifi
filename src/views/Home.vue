<template>
  <div class="home">
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
        v-for="(indicator,index) in indicatorListDummy"
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
    }
  },
  data() {
    return {
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
