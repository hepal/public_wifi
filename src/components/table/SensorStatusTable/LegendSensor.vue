<template>
  <Container>
    <List v-for="(legend, index) in legendList" :key="index">
      <Title>
        <Color :value="legend.value" /> 
        <p>{{ legend.title }}</p>
      </Title>
    </List>
  </Container>
</template>
<script>
import styled from "vue-styled-components";
import { TYPE, CODE, SCALE } from "../../../globalConst/indicatorCode";

const legendList = [
  {
    title: "정상",
    value: "good",
  },
  {
    title: "불량",
    value: "bad",
  },
];

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const List = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.div`
  width: 124px;
  display: flex;
  align-items: center;
  padding-left: 24px;
  img {
    width: 56px;
    height: 56px;
  }
  p {
    ${(props) => props.theme.type.size.body2};
    ${(props) => props.theme.type.weight.bold};
   
  }
`;
const ColorProps = { value: String };
const Color = styled("div", ColorProps)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  margin-right: 16px;
  background-color: ${(props) =>
    props.value === "good"
      ? props.theme.color.level.normal
      : props.theme.color.level.worse};
`;

export default {
  name: "Legend",
  components: {
    Container,
    List,
    Title,
    Color,
  },
  data() {
    return {
      TYPE,
      CODE,
      SCALE,
      legendList,
    };
  },
};
</script>