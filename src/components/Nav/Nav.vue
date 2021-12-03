<template>
  <Container>
    <div class="section left">
      <img :src="img_logo" alt="" />
      <div>
        디지털 트윈 폭염<br />
        대기환경 대응지원 시스템
      </div>
    </div>
    <div class="section right">
      <button>
        <img :src="ic_profile" alt="" />
      </button>
      <router-link to="/setting">
        <button>
          <img :src="ic_setting" alt="" />
        </button>
      </router-link>
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

export default {
  name: "Nav",
  components: {
    Container,
    SideBar,
    SideTab,
  },
  data() {
    return {
      img_logo,
      ic_profile,
      ic_setting,
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