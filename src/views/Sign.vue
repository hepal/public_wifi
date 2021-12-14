<template>
  <Container>
    <Content>
      <img :src="ic_logo" alt="" />
      <h2>
        대구 광역시 디지털 트윈 폭염 <br />
        대기환경 대응지원 시스템
      </h2>
      <TabContainer>
        <div class="tab">
          <Tab
            :isSelected="currentTab === 1"
            :onClick="
              () => {
                setTabIndex(1);
              }
            "
            title="로그인"
          />
        </div>
        <div class="tab">
          <Tab
            :isSelected="currentTab === 2"
            :onClick="
              () => {
                setTabIndex(2);
              }
            "
            title="회원가입"
          />
        </div>
      </TabContainer>
      <Form v-if="currentTab === 1">
        <TextField>
          <label> 아이디 </label>
          <input v-model="signinData.id" placeholder="아이디를 입력해주세요" />
          <Error v-if="signinData.isIdError">
            가입하지 않은 아이디입니다.
          </Error>
        </TextField>
        <TextField>
          <label> 비밀번호 </label>
          <input
            v-model="signinData.pw"
            placeholder="비밀번호를 입력해주세요"
          />
          <Error v-if="signinData.isPwError"> 잘못된 비번호입니다. </Error>
        </TextField>
        <Condition>
          <input type="checkbox" id="id_remember" v-model="isRememberID" />
          <label for="id_remember"> 아이디를 기억합니다. </label>
        </Condition>
        <Button :onClick="() => {}" type="PrimaryOutlined"> 로그인 </Button>
      </Form>
      <Form v-if="currentTab === 2">
        <TextField>
          <label> 이름 </label>
          <input v-model="signupData.name" placeholder="이름을 입력해주세요" />
          <Error v-if="signupData.isNameError">
            유효하지 않은 이름입니다.
          </Error>
        </TextField>
        <TextField>
          <label> 아이디 </label>
          <input v-model="signupData.id" placeholder="아이디를 입력해주세요" />
          <Error v-if="signupData.isIdError">
            유효하지 않은 아이디입니다.
          </Error>
        </TextField>
        <TextField>
          <label> 비밀번호 </label>
          <input
            v-model="signupData.pw"
            placeholder="비밀번호를 입력해주세요"
          />
          <Error v-if="signupData.isPwError">
            유효하지 않은 비밀번호입니다.
          </Error>
        </TextField>
        <TextField>
          <label> 비밀번호 확인 </label>
          <input
            v-model="signupData.pwConfirm"
            placeholder="비밀번호를 확인해주세요"
          />
          <Error v-if="signupData.isPwConfirmError">
            비밀번호가 일치하지 않습니다.
          </Error>
        </TextField>
        <Condition>
          <input type="checkbox" id="id_remember" v-model="isAgreePolicy" />
          <label for="id_remember">
            이용약관 및 개인정보 처리방침에 동의합니다.
          </label>
        </Condition>

        <Button type="PrimaryOutlined" :onClick="() => {}"> 회원가입 </Button>
      </Form>
    </Content>
  </Container>
</template>
<script>
import styled from "vue-styled-components";
import ic_logo from "../assets/img/logo.svg";
import Tab from "../components/Tab/Tab";
import Button from "@/components/Button/Button";

const Container = styled.div`
  width: calc(100% - 140px - 48px);
  height: ${`${window.innerHeight - 70 - 120}px`}
  padding: 32px;
  padding-top: 64px;
  padding-left: 156px;
  text-align: left;
  background-color: ${(props) => props.theme.color.brand.secondary100};
  ${(props) => props.theme.layout.flexColCenter}
   h2 {
    margin-bottom: 48px;
  }
`;

const Content = styled.div`
  width: 480px;
  padding: 24px;
  background-color: #fff;
  border-radius: 4px;
`;

const Form = styled.form`
  width: 100%;
  button {
    width: 100%;
  }
`;

const TextField = styled.div`
  width: calc(100% - 8px);
  margin-right: 32px;
  display: flex;
  flex-direction: column;
  margin-bottom: 48px;
  position: relative;
  label {
    ${(props) => props.theme.type.size.caption}
    color: ${(props) => props.theme.color.ui.middle};
  }
  input {
    height: 42px;
    width: 100%;
    padding-left: 8px;
    margin-top: 8px;
  }
`;
const Error = styled.p`
  width: 100%;
  color: ${(props) => props.theme.color.signal.warn};
  ${(props) => props.theme.type.size.caption};
  ${(props) => props.theme.type.weight.prd.regular};
  position: absolute;
  top: 68px;
  left: 0;
`;

const Condition = styled.div`
  width: 100%;
  margin-bottom: 24px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 48px;
  .tab {
    width: 50%;
  }
`;

export default {
  name: "Sign",
  components: {
    Container,
    Form,
    TextField,
    Tab,
    TabContainer,
    Content,
    Button,
    Error,
    Condition,
  },
  methods: {
    setTabIndex(num) {
      this.currentTab = num;
    },
  },
  data() {
    return {
      ic_logo,
      currentTab: 1,
      signinData: {
        id: "",
        pw: "",
        isIdError: true,
        isPwError: false,
      },
      signupData: {
        name: "",
        id: "",
        pw: "",
        pwConfirm: "",
        isNameError: false,
        isIdError: false,
        isPwError: false,
        isPwConfirmError: false,
      },
      isRememberID: false,
      isAgreePolicy: false,
    };
  },
};
</script>