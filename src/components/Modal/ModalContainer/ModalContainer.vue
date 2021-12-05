<template>
  <BackDrop>
    <Container :size="size">
      <button v-on:click="onClose" class="close">✕</button>
     <slot></slot>
    </Container>
  </BackDrop>
</template>
<script>
import styled from "vue-styled-components";

const BackDrop = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  ${(props) => props.theme.layout.flexColCenter}
  background-color: rgba(0,0,0,0.24);
`;

const ContainerProps = { size: String };
const Container = styled("div", ContainerProps)`
  position: relative;
  width: ${(props) => {
    switch (props.size) {
      case "small":
        return "286px";
      case "big":
        return "686px";
      default:
        return "286px";
    }
  }};
  background-color: #fff;
  padding: 48px;
  button.close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 48px;
    height: 48px;
    /* border-radius: 50%; */
    outline: none;
    border: none;
    background-color: #fff;
    color: ${(props) => props.theme.color.ui.middle2};
    ${(props) => props.theme.layout.flexColCenter}
    font-size: 20px;
  }
  h2,h3{
    margin-bottom: 64px;
  }
`;

export default {
  name: "ModalContainer",
  components: {
    BackDrop,
    Container,
  },
  props: {
    size: String,
    onClose: Function
  },
  computed: {
    childrenNode() {
      return this.$children;
    }
  }
};
</script>