<template>
  <Container
    :isSelected="isSelected"
    v-on:click="onClick"
  >
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
    title: String,
    onClick: Function
  },
};
</script>