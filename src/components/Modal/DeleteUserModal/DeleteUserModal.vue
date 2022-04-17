<template>
  <ModalContainer :size="'small'" :onClose="onClose">
    <Title>
      선택하신 사용자를 삭제하시겠습니까? <br/> 삭제 시 복구가 불가능합니다.
    </Title>
    <ActionBar>
      <Button :onClick="onOkClicked" type="RedOutlined"> 사용자 삭제 </Button>
      <Button :onClick="onClose" type="GrayOutlined"> 취소 </Button>
    </ActionBar>
  </ModalContainer>
</template>
<script>
import styled from "vue-styled-components";
import ModalContainer from "@/components/Modal/ModalContainer/ModalContainer";
import Button from "@/components/Button/Button";

const Title = styled.h3`
  color: ${(props) => props.theme.color.signal.warn};
  margin: 24px 0 48px 0;
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
  name: "DeleteUserModal",
  components: {
    ModalContainer,
    Title,
    Button,
    ActionBar,
  },
  props: {
    onClick: Function,
    onClose: Function,
    onOkClicked: Function,
  },
};
</script>