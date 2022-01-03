<template>
  <Container>
    <div class="left">
      <img class="alert" :src="ic_alert" alt='' />
      <img :src="img" alt='' />
    </div>
    <div class="right">
      <p><span>{{type}}</span>{{`${level} 발령`}}</p>
      <p>{{date}}</p>
    </div>
    <button
    v-on:click="onDelete"
    class="close">
      ✕
    </button>
  </Container>
</template>
<script>
import Container from "./Container";

// Img
import ic_alert from "../../../assets/icon/action/alert.svg";

export default {
  name: "WarnAlarmList",
  components: {
    Container
  },
  props: {
    type: String,
    level: String,
    date: String,
    img: String,
    onDelete: Function
  },
  data(){
    return {
      ic_alert
    }
  }
}
</script>