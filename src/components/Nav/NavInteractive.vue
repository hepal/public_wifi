<template>
  <Container>
    <div class="section left">
      <img :src="img_logo" alt="" />
      <Title>
        공공와이파이를 활용한 디지털트윈<br />
        폭염/대기환경 대응지원 서비스
      </Title>
    </div>
    <div class="section right">
      <button  v-on:click="isSettingPop = !isSettingPop">
        <img :src="ic_profile" alt="" />
      </button>
        <button v-on:click="setCurrentScreen('SETTING')">
          <img :src="ic_setting" alt="" />
        </button>
      <DropDownContainer
        v-if="isSettingPop"
      >
        <List>
          관리자명: 김철수
        </List>
        <Menu v-on:click="isSettingPop = false">
          <button v-on:click="setCurrentScreen('USERMANAGING')">
          사용자 관리
          </button>
        </Menu>
        <Menu>
          비밀번호 변경
        </Menu>
      </DropDownContainer>
    </div>
    <SideBar>
      <SideTab
        v-for="tab in tabList"
        :key="tab.title"
        :title="tab.title"
        :imgOn="tab.imgOn"
        :imgOff="tab.imgOff"
        :isSelected="currentScreen===tab.name"
        :to="tab.to"
        :name="tab.name"
        :setCurrentScreen="setCurrentScreen"
      />
    </SideBar>
  </Container>
</template>
<script>
import styled from "vue-styled-components";
// components
import Container from "./Container";
import SideBar from "./SideBar";
import SideTab from "../SideTab/SideTab";

// assets
import img_logo from "../../assets/img/logo.svg";
import ic_profile from "../../assets/icon/profile.svg";
import ic_setting from "../../assets/icon/setting.svg";
import tab_map_on from "../../assets/icon/map/on.svg";
import tab_map_off from "../../assets/icon/map/off.svg";
import tab_statisfic_on from "../../assets/icon/statistic/on.svg";
import tab_statisfic_off from "../../assets/icon/statistic/off.svg";

const DropDownContainer = styled.div`
  position: absolute;
  top: 56px;
  right: 64px;
  width: 168px;
  background-color: #fff;
  z-index: 999;
  box-shadow: 0px 0px 12px rgba(0,0,0,0.12);
  border-radius: 4px;
  overflow: hidden;
`;

const Title = styled.div`
  ${props => props.theme.type.size.caption};
  ${props => props.theme.type.weight.prd.bold};
  padding-left: 4px;
`;

const List = styled.div`
  width: 100%;
  height: 32px;
  padding: 12px;
  display: flex;
  align-items: center;
  ${props => props.theme.type.size.body2}
  border-bottom: solid 0.5px ${props => props.theme.color.ui.low};
`;

const Menu = styled.div`
  width: 100% !important;
  height: 32px !important;
  padding: 12px !important;
  display: flex !important;
  align-items: center!important;
  ${props => props.theme.type.size.body2}
  border-bottom: solid 0.5px ${props => props.theme.color.ui.low};
  cursor: pointer;
  a{
    color: ${props => props.isSelected?props.theme.color.ui.strong:props.theme.color.ui.middle2} !important;
    text-decoration: none; 
  }
  button{
    color: ${props => props.isSelected?props.theme.color.ui.strong:props.theme.color.ui.middle2} !important;
    text-decoration: none; 
    padding: 0;
    height: 100%;
    width: calc(100% - 24px);
    align-items: flex-start;
    text-align: left;
    ${props => props.theme.type.size.body2}
  }
`;


export default {
  name: "NavInteractive",
  components: {
    Container,
    SideBar,
    SideTab,
    DropDownContainer,
    List,
    Menu,
    Title
  },
  props: {
    setCurrentScreen: Function,
    currentScreen: String
  },
  data() {
    return {
      img_logo,
      ic_profile,
      ic_setting,
      isSettingPop: false,
      tabList: [
        {
          title: "메인 지도",
          imgOn: tab_map_on,
          imgOff: tab_map_off,
          isSelected: false,
          name: "MAP",
          to: "/",
        },
        // {
        //   title: '노선 정보',
        //   imgOn: tab_route_on,
        //   imgOff: tab_route_off,
        //   isSelected: false,
        //    to: "/"
        // },
        {
          title: "통계 관리",
          imgOn: tab_statisfic_on,
          imgOff: tab_statisfic_off,
          isSelected: false,
          name: "STATISTIC",
          to: "/Statistic",
        },
      ],
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
  methods: {
    isRoute(name) {
      return this.$route.name === name;
    },
  },
};
</script>