<template>
  <Container
    :bg="
      currentMapStyle === 'mono' ? map_bg_dummy_mono : map_bg_dummy_satellite
    "
  >
    <!-- Information -->
    <BusEntity
      v-for="(bus,index) in busDataDummy"
      :key="index"
      :number="bus.number"
      :x="bus.location.x"
      :y="bus.location.y"
    />
    <LocationInfoEntity
      v-for="(location, index) in locationInfoDataDummy"
      :key="index"
      :title="location.title"
      :dust="location.dust"
      :no2="location.no2"
      :o3="location.o3"
      :temperature="location.temperature"
      :humid="location.temperature"
      :x="location.location.x"
      :y="location.location.y"
    />
    <MapControlled>
      <button>
        <img :src="ic_refresh" alt="" />
      </button>
      <button>
        <img :src="ic_zoom_in" alt="" />
      </button>
      <button>
        <img :src="ic_zoom_out" alt="" />
      </button>
    </MapControlled>
    <MapStyleSelector :isSelected="isMapStylerSelected">
      <Wrapper>
        <button v-on:click="isMapStylerSelected = !isMapStylerSelected">
          <img :src="ic_map_layer" alt="" />
          <span>맵스타일</span>
        </button>
        <ButtonMap
          :bg="img_map_style_mono"
          v-on:click="
            isMapStylerSelected = !isMapStylerSelected;
            currentMapStyle = 'mono';
          "
        >
          <span>모노크롬</span>
        </ButtonMap>
        <ButtonMap
          :bg="img_map_style_satellite"
          v-on:click="
            isMapStylerSelected = !isMapStylerSelected;
            currentMapStyle = 'satellite';
          "
        >
          <span>위성</span>
        </ButtonMap>
      </Wrapper>
    </MapStyleSelector>
  </Container>
</template>
<script>
import styled from "vue-styled-components";
import Container from "./Container";
import LocationInfoEntity from "@/components/LocationInfoEntity/LocationInfoEntity";
import BusEntity from "@/components/BustEntity/BusEntity";

// 맵 영역 표시용 더미 이미지
import map_bg_dummy_mono from "../../assets/dummy/map_bg_mono.jpg";
import map_bg_dummy_satellite from "../../assets/dummy/map_bg_satellite.jpg";

// Assets
import ic_refresh from "../../assets/icon/action/refresh.svg";
import ic_zoom_in from "../../assets/icon/action/zoom_in.svg";
import ic_zoom_out from "../../assets/icon/action/zoom_out.svg";
import ic_map_layer from "../../assets/icon/layer.svg";
import img_map_style_mono from "../../assets/img/img_map_style_mono.jpg";
import img_map_style_satellite from "../../assets/img/img_map_style_satellite.jpg";

const MapControlled = styled.div`
  position: fixed;
  z-index: 9;
  right: 24px;
  bottom: 24px;
  border-radius: 4px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.12);
  width: 48px;
  button {
    width: 48px;
    height: 48px;
    outline: none;
    border: none;
    background-color: #fff;
    ${(props) => props.theme.layout.flexColCenter}
    img {
      width: 24px;
      height: 24px;
    }
  }
`;

const SelectorProps = { isSelected: Boolean };
const MapStyleSelector = styled("div", SelectorProps)`
  position: fixed;
  z-index: 9;
  display: flex;
  width: ${(props) =>
    `${props.isSelected ? `calc(56px * 3)` : `calc(56px * 1)`}`};
  height: 56px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.12);
  left: 124px;
  bottom: 180px;
  border-radius: 4px;
  overflow: hidden;
  transition: width 0.3s ease-in-out;
  button {
    width: 56px;
    height: 56px;
    outline: none;
    border: none;
    background-color: #fff;
    position: relative;
    ${(props) => props.theme.layout.flexColCenter}
    img {
      width: 24px;
      height: 24px;
      margin-bottom: 16px;
    }
    span {
      ${(props) => props.theme.type.size.caption2};
      ${(props) => props.theme.type.weight.prd.medium};
      color: ${(props) => props.theme.color.ui.midle2};
      width: 100%;
      text-align: center;
      position: absolute;
      left: 0;
      bottom: 8px;
    }
  }
`;
const Wrapper = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  width: calc(56px * 3);
  height: 56px;
`;

const ButtonProps = { bg: String };
const ButtonMap = styled("button", ButtonProps)`
  position: relative;
  width: 56px;
  height: 56px;
  outline: none;
  border: none;
  color: #fff;
  ${(props) => props.theme.layout.flexColCenter}
  background-image: ${(props) => `url(${props.bg})`};
  background-size: cover;
  background-position: center;
  ${(props) => props.theme.type.size.caption2};
  ${(props) => props.theme.type.weight.prd.bold};
  text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.4);
  span {
    z-index: 9;
    width: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 8px;
  }
  :before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.24);
  }
`;

export default {
  name: "MapCanvas",
  components: {
    Container,
    MapControlled,
    MapStyleSelector,
    ButtonMap,
    Wrapper,
    LocationInfoEntity,
    BusEntity
  },
  data() {
    return {
      map_bg_dummy_mono,
      map_bg_dummy_satellite,
      ic_refresh,
      ic_zoom_in,
      ic_zoom_out,
      ic_map_layer,
      img_map_style_mono,
      img_map_style_satellite,
      isMapStylerSelected: false,
      currentMapStyle: "mono", // 'monoe' || 'satellite'
      busDataDummy: [
        {
          number: 523,
          location: {
            x: 400,
            y: 340,
          },
        },
        {
          number: 523,
          location: {
            x: 600,
            y: 540,
          },
        },
        {
          number: 523,
          location: {
            x: 250,
            y: 580,
          },
        },
      ],
      locationInfoDataDummy: [
        {
          locationName: "대구광역시 OOO동",
          dust: 0.001,
          no2: 0.012,
          o3: 0.01,
          temperature: 34,
          humid: 65,
          location: {
            x: 500,
            y: 240,
          },
        },
        {
          locationName: "대구광역시 OOO동",
          dust: 0.001,
          no2: 0.012,
          o3: 0.01,
          temperature: 34,
          humid: 65,
          location: {
            x: 900,
            y: 180,
          },
        },
        {
          locationName: "대구광역시 OOO동",
          dust: 0.001,
          no2: 0.012,
          o3: 0.01,
          temperature: 34,
          humid: 65,
          location: {
            x: 600,
            y: 480,
          },
        },
        {
          locationName: "대구광역시 OOO동",
          dust: 0.001,
          no2: 0.012,
          o3: 0.01,
          temperature: 34,
          humid: 65,
          location: {
            x: 120,
            y: 560,
          },
        },
      ],
    };
  },
};
</script>