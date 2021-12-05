<template>
  <ModalContainer
    :size="'small'"
    :onClose="onClose"
  >
    <Title>
      초미세먼지 주의보 발령
    </Title>
    <Content>
      <p>
        <span>날짜:</span> 2021-11-12
      </p>
      <p>
        <span>시간:</span>  3:15:21pm
      </p>
    </Content>
    <ActionBar>
      <Button
        :onClick="onClose"
        type="PrimaryOutlined"
      >
        확인
      </Button>
      <Button
        :onClick="onNext"
        type="PrimaryFilled"
      >
        상황전파
      </Button>
    </ActionBar>
  </ModalContainer>
</template>
<script>
import styled from "vue-styled-components";
import ModalContainer from '@/components/Modal/ModalContainer/ModalContainer'
import Button from '@/components/Button/Button';

const Title = styled.h3`
  color: ${props => props.theme.color.signal.warn};
  margin: 24px 0 48px 0;
`;

const Content = styled.div`
  p{
    margin: 0;
  }
  span{
    ${props => props.theme.type.weight.prd.bold}
  }
`;

const ActionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  button{
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
    ActionBar
  },
  props: {
    onClose: Function,
    onNext: Function
  }
}
</script>