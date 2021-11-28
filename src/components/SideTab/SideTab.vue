<template>
  <Container>
    <img :src="isSelected ? imgOn : imgOff" alt="" />
    {{ title }}
  </Container>
</template>
<script>
import Container from "./Container";
export default {
  name: "SideTab",
  components: {
    Container,
  },
  props: {
    isSelected: Boolean,
    imgOn: String,
    imgOff: String,
    title: String,
  },
};
</script>