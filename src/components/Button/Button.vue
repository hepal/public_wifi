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
  padding: 0px 24px;
  height: 48px;
  ${(props) => {
    switch (props.type) {
      case "PrimaryOutlined":
        return props.theme.container.static.primaryOutlined;
      case "PrimaryFilled":
        return props.theme.container.static.primaryFilled;
      case "GrayOutlined":
        return props.theme.container.static.grayOutlined;
      case "RedOutlined":
        return props.theme.container.static.redOutlined;
      default:
        return props.theme.container.static.primaryOutlined;
    }
  }};
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