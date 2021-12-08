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

import Container from "./Container";





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