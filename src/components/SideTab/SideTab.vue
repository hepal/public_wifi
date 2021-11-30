<template>
  <Container>
    <router-link :to="to">
       <img :src="isSelected ? imgOn : imgOff" alt="" />
       {{ title }}
    </router-link>
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
    to: String
  },
};
</script>