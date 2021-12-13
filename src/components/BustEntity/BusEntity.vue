<template>
  <Container :x="x" :y="y">
    <img :src="ic_bus" alt="" />
    <p>{{ number }}</p>
  </Container>
</template>
<script>
import styled from "vue-styled-components";
import ic_bus from "../../assets/icon/ic_bus.svg";

const ContainerProps = {
  x: Number,
  y: Number,
};

const Container = styled("div", ContainerProps)`
  position: absolute;
  top: ${(props) => `${props.y}px`};
  left: ${(props) => `${props.x}px`};
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #fff;
  box-shadow: rgba(0,0,0,0.12) 0px 0px 12px;
  ${(props) => props.theme.layout.flexColCenter}
  img{
    margin-top: 4px;
  }
  p {
    ${(props) => props.theme.type.size.caption2}
    ${(props) => props.theme.type.weight.prd.bold}
    color: ${props => props.theme.color.ui.middle1}
    margin: 0px;
  }
`;

export default {
  name: "BusEntity",
  components: {
    Container,
  },
  data() {
    return {
      ic_bus,
    };
  },
  props: {
    x: Number,
    y: Number,
    number: Number,
  },
};
</script>