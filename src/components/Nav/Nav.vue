<template>
  <Container>
    <div class="section left">
      <img :src="img_logo" alt="" />
      <div>
        공공와이파이를 활용한 디지털트윈<br />
        폭염/대기환경 대응지원 서비스
      </div>
    </div>
    <div class="section right">
      <button  v-on:click="isSettingPop = !isSettingPop">
        <img :src="ic_profile" alt="" />
      </button>
      <router-link to="/setting">
        <button>
          <img :src="ic_setting" alt="" />
        </button>
      </router-link>
      <DropDownContainer
        v-if="isSettingPop"
      >
        <List>
          관리자명: 김철수
        </List>
        <Menu v-on:click="isSettingPop = false">
          <router-link to="/manageuser">
          사용자 관리
          </router-link>
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
        :isSelected="isRoute(tab.name)"
        :to="tab.to"
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
// import tab_route_on from "../../assets/icon/route_detail/on.svg";
// import tab_route_off from "../../assets/icon/route_detail/off.svg";
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
`;


export default {
  name: "Nav",
  components: {
    Container,
    SideBar,
    SideTab,
    DropDownContainer,
    List,
    Menu,
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
          name: "Home",
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
          name: "Statistic",
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