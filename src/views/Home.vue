<template>
  <div class="home">
    <NavInteractive
      :setCurrentScreen="setCurrentScreen"
      :currentScreen="currentScreen"
    />
    {{currentScreen}}
    <!-- 맵 캔버스 -->
    <MapCanvas />
    <!-- 버르 루트정보 FAB -->
    <ButtonToggleRoute v-on:click="isRoutePop = !isRoutePop">
      <img :src="ic_route" alt="" />
    </ButtonToggleRoute>
    <!-- 버스 루트 슬라이드 -->
    <BusRouteSlide :isPop="isRoutePop" :togglePop="togglePop" />
    <!-- 주요 기상정보 지표 컨테이너 -->
    <IndicatorContainer>
      <CardIndicator
        v-for="(indicator, index) in indicatorListDummy"
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
      />
    </AlarmListContainer>
    <!-- 스크린 -->
    <ScreenContainer v-if="currentScreen==='STATISTIC'">
      <Statistic/>
    </ScreenContainer>
    <ScreenContainer v-if="currentScreen==='SETTING'">
      <Setting/>
    </ScreenContainer>
    <ScreenContainer v-if="currentScreen==='USERMANAGING'">
      <ManageUser/>
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
// @ is an alias to /src
import styled from "vue-styled-components";
import NavInteractive from '@/components/Nav/NavInteractive';
import MapCanvas from "../components/MapCanvas/MapCanvas";
import Statistic from '@/views/Statistic';
import Setting from '@/views/Setting';
import ManageUser from '@/views/ManageUser';
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
    setCurrentScreen(screenName) {
      this.currentScreen = screenName;
    },
    setCurretIndicator(code) {
      this.currentIndictor = code;
    }
  },
  data() {
    return {
      TYPE,
      // 라우터 대신 사용할 현재 화면 값
      // MAP, STATISTIC, SETTING, USERMANAGING
      currentScreen:'MAP',
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
          value: 23,
          img: ic_dust,
          isSelected: false,
        },
        {
          id: TYPE.NO2,
          title: "이산화질소(NO2)",
          unit: "ppm",
          value: 0.012,
          img: ic_no2,
          isSelected: false,
        },
        {
          id: TYPE.O3,
          title: "오존(O3)",
          unit: "ppm",
          value: 23,
          img: ic_o3,
          isSelected: false,
        },
        {
          id: TYPE.TEMPERATURE,
          title: "온도",
          unit: "°C",
          value: 31,
          img: ic_temp,
          isSelected: false,
        },
        {
          id: TYPE.HUMID,
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
  }
};
</script>