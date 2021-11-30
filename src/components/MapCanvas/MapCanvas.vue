<template>
  <div>
    <Container
      :bg="map_bg_dummy"
      :color="'#ffcc00'"
    >
    </Container>
  </div>
</template>
<script>
import Container from "./Container";
// 맵 영역 표시용 더미 이미지
import map_bg_dummy from "../../assets/dummy/map_bg_mono.jpg"

export default {
  name: 'MapCanvas',
  components: {
    Container
  },
  data() {
    return {
      map_bg_dummy
    }
  },
};
</script>