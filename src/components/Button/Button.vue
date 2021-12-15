<template>
  <Container
    :type="type"
    v-on:click="onClick"
  >
  <slot></slot>
  </Container>
</template>
<script>
import styled from "vue-styled-components";

const ButtonProps = {
  type: String
}
const Container = styled('button',ButtonProps)`
  padding: 0px 32px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => {
    switch (props.type) {
      case "PrimaryOutlined":
        return props.theme.container.static.primaryOutlined;
      case "PrimaryFilled":
        return props.theme.container.static.primaryFilled;
      case "GrayOutlined":
        return props.theme.container.static.grayOutlined;
      case "RedOutlined":
        return props.theme.container.interactive.redOutlined.enable;
      default:
        return props.theme.container.static.primaryOutlined;
    }
  }};
  img{
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
`;

export default {
  name: "Button",
  props: {
    type: String,
    onClick: Function
  },
  components:{
    Container
  }
};
</script>