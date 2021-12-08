<template>
  <ModalContainer :size="'big'" :onClose="onClose">
    <h2>초미세먼지 주의보 발령</h2>
    <TabContainer>
      <Tab :isActive="step === 0"> 1.상황접수 </Tab>
      <Tab :isActive="step === 1"> 2.메세지 발송 </Tab>
    </TabContainer>
    <Content v-if="step === 0">
      <SectionRow>
        <List v-for="(list, index) in typeList" :key="index">
          <span>
            {{ `${index + 1}. ${list.title}` }}
          </span>
          <input id="alert" type="radio" v-model="list.value" value="alert" />
          <label for="alert"> 주의보 </label>
          <input id="warn" type="radio" v-model="list.value" value="warn" />
          <label for="alert"> 경보 </label>
        </List>
      </SectionRow>
    </Content>
    <Content v-if="step === 1">
      <TableWithSelection
        :tableData="recipientList"
        :selectedRecipientList="selectedRecipientList"
      />
    </Content>
    <ActionBar v-if="step === 0">
      <Button :onClick="onClose" type="PrimaryOutlined"> 닫기 </Button>
      <Button type="PrimaryFilled" :onClick="() => moveStep(1)"> 다음 </Button>
    </ActionBar>
    <ActionBar v-if="step === 1">
      <Button :onClick="() => moveStep(0)" type="PrimaryOutlined">
        이전단계
      </Button>
      <Button 
        type="PrimaryFilled"
        :onClick="() => {}"
      > 상황전파 </Button>
    </ActionBar>
  </ModalContainer>
</template>
<script>
import styled from "vue-styled-components";
import ModalContainer from "@/components/Modal/ModalContainer/ModalContainer";
import Button from "@/components/Button/Button";
import TableWithSelection from '@/components/table/TableWithSelection/TableWithSelection';

const Content = styled.div`
  p {
    margin: 0;
  }
  span {
    ${(props) => props.theme.type.weight.prd.bold}
  }
`;

const TabContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 24px;
  margin-bottom: 32px;
`;

const TabProp = { isActive: Boolean };
const Tab = styled("div", TabProp)`
  width: 50%;
  height: 48px;
  color: ${(props) =>
    props.isActive
      ? props.theme.color.brand.primary700
      : props.theme.color.ui.low};
  background-color: ${(props) =>
    props.isActive
      ? props.theme.color.ui.white500
      : props.theme.color.ui.white700};
  ${(props) => props.theme.layout.flexColCenter}
`;

const SectionRow = styled.div`
  width: calc(100% - 48px);
  display: flex;
  flex-wrap: wrap;
  padding: 24px;
  border: solid 0.5px ${(props) => props.theme.color.ui.low};
  border-radius: 4px;
  margin-bottom: 24px;
  margin-bottom: 32px;
`;

const List = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  border-bottom: solid 0.5px ${(props) => props.theme.color.ui.low};
  span {
    width: 200px;
    text-align: left;
  }
  input[type="radio"] {
    margin: 0px;
    margin-right: 4px;
  }
  label {
    margin-right: 24px;
  }
`;

const ActionBar = styled.div`
  width: 50%;
  padding-left: 50%;
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  button {
    width: calc(50% - 8px);
  }
`;

export default {
  name: "SubmitMsgModal",
  components: {
    ModalContainer,
    SectionRow,
    Content,
    Button,
    ActionBar,
    TabContainer,
    Tab,
    List,
    TableWithSelection
  },
  props: {
    onClose: Function,
  },
  data() {
    return {
      step: 0,
      typeList: [
        {
          title: "초미세먼지",
          value: "",
        },
        {
          title: "오존",
          value: "",
        },
        {
          title: "폭염",
          value: "",
        },
        {
          title: "한파",
          value: "",
        },
        {
          title: "건조",
          value: "",
        },
      ],
      recipientList: {
        header: [
          "NO",
          "이름",
          "전화번호"
        ],
        data: [
          {
            name: "김철수",
            number: "010-1234-5678",
            isCheck: false,
          },
          {
            name: "김철수",
            number: "010-1234-5678",
            isCheck: false,
          },
          {
            name: "김철수",
            number: "010-1234-5678",
            isCheck: false,
          },
          {
            name: "김철수",
            number: "010-1234-5678",
            isCheck: false,
          },
          {
            name: "김철수",
            number: "010-1234-5678",
            isCheck: false,
          },
        ],
      },
      selectedRecipientList: []
    };
  },
  methods: {
    moveStep(index) {
      this.step = index;
    },
  },
};
</script>