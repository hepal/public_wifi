<template>
  <Container>
    <SettingSlide ref="settingSlide" />
  </Container>
</template>
<script>
import SettingSlide from '@/components/slide/SettingSlide/SettingSlide';
import styled from "vue-styled-components";

const Container = styled.div`
  width: 100%;
`;

var settingSlideInstance = null;

function updateSensorState(activeSensorList) {
  settingSlideInstance.$refs.settingSlide.updateSensorState(activeSensorList);
}

export default{
  name: "Setting",
  components: {
    SettingSlide,
    Container
  },
  created: function () {
    settingSlideInstance = this;
  },
  data() {
    return {

    }
  }
}
</script>