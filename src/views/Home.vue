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
  </div>
</template>

<script>
// @ is an alias to /src
import styled from 'vue-styled-components';
import MapCanvas from "../components/MapCanvas/MapCanvas";
import CardIndicator from "../components/Card/CardIndicator/CardIndicator";

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

export default {
  name: 'Home',
  components: {
    MapCanvas,
    IndicatorContainer,
    CardIndicator
  },
  data() {
    return {
      indicatorListDummy: [
        {
          id: 'dust',
          title: '초미세먼지',
          unit: '㎍/㎥',
          value: 23,
          img: ic_dust,
          isSelected: false
        },
        {
          id: 'no2',
          title: '이산화질소(NO2)',
          unit: 'ppm',
          value: 0.012,
          img: ic_no2,
          isSelected: false
        },
        {
          id: 'o3',
          title: '오존(O3)',
          unit: 'ppm',
          value: 23,
          img: ic_o3,
          isSelected: false
        },
        {
          id: 'temp',
          title: '온도',
          unit: '°C',
          value: 31,
          img: ic_temp,
          isSelected: false
        },
        {
          id: 'humid',
          title: '습도',
          unit: '%',
          value: 23,
          img: ic_humid,
          isSelected: false
        },
      ]
    }
  }
}
</script>
