<template>
  <Container
    :x="x" :y="y"
    v-on:mouseover="isInfoShow=true"
    v-on:mouseleave="isInfoShow=false"
  >
    <Info v-if="isInfoShow">
      <p>
        <span>위치:</span>
        {{ locationName }}        
      </p>
      <p>
        <span>초미세먼지:</span>
        {{ dust }}
        ㎍/㎥
      </p>
      <p>
        <span>이산화질소:</span>
        {{ no2 }}
        ppm
      </p>
      <p>
        <span>오존:</span>
        {{ o3 }}
        ppm
      </p>
      <p>
        <span>온도:</span>
        {{ temperature }}
        °C
      </p>
      <p>
        <span>습도:</span>
        {{ humid }}
        %
      </p>
    </Info>
  </Container>
</template>
<script>
import styled from "vue-styled-components";

const ContainerProps = {
  x: Number,
  y: Number,
  dust: Number,
  no2: Number,
  o3: Number,
  temperature: Number,
  humid: Number,
};

// const Container = styled("div", ContainerProps)`
//   position: absolute;
//   border-radius: 6px;
//   width: 48px;
//   height: 48px;
//   background-color: ${(props) => props.theme.color.brand.primary600};
//   top: ${(props) => `${props.y}px`};
//   left: ${(props) => `${props.x}px`};
//   cursor: pointer;
// `;

const Container = styled("div", ContainerProps)`
  position: absolute;
  border-radius: 6px;
  width: 48px;
  height: 96px;
  background-color: transparent;
  top: ${(props) => `${props.y}px`};
  left: ${(props) => `${props.x}px`};
  cursor: pointer;
`;

const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 186px;
  padding: 8px;
  background-color: #fff;
  text-align: left;
  ${(props) => props.theme.type.size.caption}
  ${props => props.theme.type.weight.prd.regular}
  p{
    margin: 0px;
    margin-bottom: 4px;
  }
  span{
    ${props => props.theme.type.weight.prd.bold}
  }
`;

export default {
  name: "LocationInfoEntity",
  components: {
    Container,
    Info,
  },
  props: {
    title: String,
    locationName : String,
    dust: Number,
    no2: Number,
    o3: Number,
    temperature: Number,
    humid: Number,
    x: Number,
    y: Number,
  },
  data() {
    return {
      isInfoShow: false,
    }
  },
};
</script>