<template>
  <ModalContainer :size="'small'" :onClose="onClose">
    <Title> {{alert_title}} </Title>
    <Content>
      <p><span>날짜:</span> {{ alert_day }}</p>
      <p><span>시간:</span> {{ alert_time }}</p>
    </Content>
    <ActionBar>
      <Button :onClick="onClose" type="PrimaryOutlined"> 확인 </Button>
      <Button :onClick="onNext" type="PrimaryFilled"> 상황전파 </Button>
    </ActionBar>
  </ModalContainer>
</template>
<script>
import styled from "vue-styled-components";
import ModalContainer from "@/components/Modal/ModalContainer/ModalContainer";
import Button from "@/components/Button/Button";

var alertNoticeMordal = null;

const Title = styled.h3`
  color: ${(props) => props.theme.color.signal.warn};
  margin: 24px 0 48px 0;
`;

const Content = styled.div`
  p {
    margin: 0;
  }
  span {
    ${(props) => props.theme.type.weight.prd.bold}
  }
`;

const ActionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  button {
    width: calc(50% - 8px);
  }
`;

export default {
  name: "AlertNoticeModal",
  components: {
    ModalContainer,
    Title,
    Content,
    Button,
    ActionBar,
  },
  data() {
    return {
      alert_title: "초미세먼지 주의보 발령",
      alert_day: "2021-10-21",
      alert_time: "13:11:29",
    };
  },
  created() {
    this.alertNoticeMordal = this;
  },
  mounted() {
    this.$emit('update',this);
  },
  props: {
    onClose: Function,
    onNext: Function,
  },
  methods: {
    setAlarmData(a_day,a_time,a_message) {
      this.alertNoticeMordal.alert_title = a_message;
      this.alertNoticeMordal.alert_day = a_day;
      this.alertNoticeMordal.alert_time = a_time;
    },
  },
};
</script>
