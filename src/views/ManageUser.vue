<template>
  <Conainer>
    <h3>사용자 검색</h3>
    <Top>
      <TextField>
        <label> 이름 </label>
        <input v-model="search_name" placeholder="이름을 입력해주세요" />
      </TextField>
      <TextField>
        <label> 아이디 </label>
        <input v-model="search_id" placeholder="아이디를 입력해주세요" />
      </TextField>
      <Button type="PrimaryFilled">
        <img :src="ic_search" alt="" />
        사용자 검색
      </Button>
    </Top>
    <h3>검색결과 7건</h3>
    <TableContainer>
      <TableWithSelectionUser :tableData="userListDummy" />
    </TableContainer>
    <ActionBar>
      <Button type="GrayOutlined">
         <router-link to="/">
            이전으로 돌아가기
         </router-link>
      </Button>
      <Button
        type="RedOutlined"
        :onClick="toggleDeletePop"
      >
        사용자 삭제
      </Button>
    </ActionBar>
    <!-- 팝업 -->
    <DeleteUserModal
      v-if="is_delete_pop"
      :onClose="toggleDeletePop"
    />
  </Conainer>
</template>
<script>
import styled from "vue-styled-components";
import Button from "../components/Button/Button";
import ic_search from "../assets/icon/search/white.svg";
import TableWithSelectionUser from "@/components/table/TableWithSelection/TableWithSelectionUser";
import DeleteUserModal from '@/components/Modal/DeleteUserModal/DeleteUserModal';

const Conainer = styled.div`
  width: calc(100% - 140px - 32px);
  height: 100%;
  padding: 32px;
  padding-top: 96px;
  padding-left: 156px;
  text-align: left;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  margin-bottom: 48px;
`;

const TextField = styled.div`
  width: 256px;
  margin-right: 32px;
  display: flex;
  flex-direction: column;
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

const ActionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const TableContainer = styled.div`
  width: 100%;
  height: 480px;
  overflow-y: overlay;
`;

export default {
  name: "ManageUser",
  components: {
    Conainer,
    Top,
    Button,
    TextField,
    TableWithSelectionUser,
    TableContainer,
    ActionBar,
    DeleteUserModal
  },
  data() {
    return {
      ic_search,
      search_name: null,
      search_id: null,
      is_delete_pop: false,
      // 유저리스트 더미 데이터
      userListDummy: {
        header: ["NO", "이름", "아이디", "권한", "비고"],
        data: [
          {
            name: "김철수",
            id: "abcdef",
            role: "총괄 관리자",
            etc: "",
          },
          {
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
          {
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
          {
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
          {
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
          {
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
          {
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
          {
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
          {
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
          {
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
          {
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
        ],
      },
    };
  },
  methods: {
    toggleDeletePop (){
      this.is_delete_pop = !this.is_delete_pop;
    }
  }
};
</script>