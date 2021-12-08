<template>
  <Container>
    <SettingSlide />
  </Container>
</template>
<script>
import SettingSlide from '@/components/slide/SettingSlide/SettingSlide';
import styled from "vue-styled-components";

const Container = styled.div`
  width: 100%;
`;

export default{
  name: "Setting",
  components: {
    SettingSlide,
    Container
  },
  data() {
    return {

    }
  }
}
</script>