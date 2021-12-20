<template>
  <Container
    :isSelected="isSelected"
    v-on:click="setCurretIndicator(id)"
  >
    <div class="top">
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
    isSelected: Boolean,
    id: String,
    setCurretIndicator: Function
  }
}
</script>