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

var jsonData = {
  requestSensorData : {
    beginYear: 2021,
    beginMonth: 12,
    beginDay: 6,
    endYear: 2021,
    endMonth: 12,
    endDay: 6
  }
};

var sensorMap = new HashMap();

//선과 점과의 거리를 구한다.
function pDistance(x, y, x1, y1, x2, y2) {

  var A = x - x1;
  var B = y - y1;
  var C = x2 - x1;
  var D = y2 - y1;

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0) //in case of 0 length line
      param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  }
  else if (param > 1) {
    xx = x2;
    yy = y2;
  }
  else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  var dx = x - xx;
  var dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}


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