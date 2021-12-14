<template>
  <Container @click.native="testFunction(sensoeId)">
    <div class="top" >
      <img :src="img" alt='' />
      <span>{{title}}</span>
    </div>
    <div class="bottom">
      <div class="value">
        {{value}}
      </div>
      <div class="unit">
        {{unit}}
      </div>
    </div>
  </Container>
</template>
<script>

import axios from 'axios';
import Container from "./Container";
import HashMap from 'hashmap';

// var jsonData = {
//   requestSensorData : {
//     beginYear: 2021,
//     beginMonth: 12,
//     beginDay: 6,
//     endYear: 2021,
//     endMonth: 12,
//     endDay: 6
//   }
// };

// var sensorMap = new HashMap();

export default {
  name: "CardIndicator",
  components: {
    Container
  },
  props: {
    sensoeId: String,
    title: String,
    img: String,
    value: Number,
    unit: String,
    isSelected: Boolean
  },
  methods: {
    testFunction : function(event) {
      console.log(event)
      //requestData()
      this.$emit("requestSensorData")
    },
  }
}
</script>