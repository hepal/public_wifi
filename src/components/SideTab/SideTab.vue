<template>
  <Container
    v-on:click="setCurrentScreen(name)"
    :isSelected="isSelected"
  >
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
    name: String,
    to: String,
    setCurrentScreen: Function
  },
};
</script>