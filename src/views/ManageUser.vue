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
      <Button type="PrimaryFilled" :onClick="searchUser" >
        <img :src="ic_search" alt="" />
        사용자 검색
      </Button>
    </Top>
    <h3>검색결과 {{userCount}}건</h3>
    <TableContainer>
      <TableWithSelectionUser :tableData="userListDummy" />
    </TableContainer>
    <ActionBar>
      <!--
      <Button type="GrayOutlined" :onClick="preview">
         <router-link to="/">
            이전으로 돌아가기
         </router-link>
      </Button>
      -->
      <Button
        type="RedOutlined"
        :onClick="confirmDeleteUser"
      >
        사용자 삭제
      </Button>
    </ActionBar>    
    
  </Conainer>
</template>
<script>
import styled from "vue-styled-components";
import Button from "../components/Button/Button";
import ic_search from "../assets/icon/search/white.svg";
import TableWithSelectionUser from "@/components/table/TableWithSelection/TableWithSelectionUser";
import axios from 'axios';
import HashMap from "hashmap";
//import DeleteUserModal from '@/components/Modal/DeleteUserModal/DeleteUserModal';

var userMap = new HashMap();
var avgChart = null;
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
    ActionBar    
  },
  data() {    
    return {      
      userCount : 0,
      ic_search,
      search_name: null,
      search_id: null,
      is_delete_pop: false,
      // 유저리스트 더미 데이터
      userListDummy: {
        header: ["NO", "이름", "아이디", "권한", "비고"],
        data: [
          {
            isCheck : true,
            name: "김철수",
            id: "abcdef",
            role: "총괄 관리자",
            etc: "",
          },
          {
            isCheck : true,
            name: "김철수",
            id: "abcdef",
            role: "일반 관리자",
            etc: "",
          },
        ],
      },
    };
  },
   created: function () {
    avgChart = this;
  },
  mounted: function() {
    if (null == avgChart || undefined == avgChart) {
      return;
    }

    avgChart.requestUserList();
  },
  methods: {
    requestUserList() {
      let userData = {
        requestManagerList: true
      };

      axios
        .post("http://210.90.145.70:12000/Account", JSON.stringify(userData), {
          headers: { "Content-Type": "application/json" },
        })
        .then(function (response) {
          if (response.status == 200) {
            avgChart.userListDummy.data = [];
            userMap.clear();
            console.log(response);

            for (let i of response.data.managerList) {
              userMap.set(i.id,i);

              let d = {                
                name: i.name,
                id: i.id,
                role: i.type,
                etc: i.note,              
              };
            
              console.log(d);
              avgChart.userListDummy.data.push(d);
            }

            avgChart.userCount = response.data.managerList.length;
          }
        });       
    },
    toggleDeletePop (){
      this.is_delete_pop = !this.is_delete_pop;
      alert(this.is_delete_pop);
    },
    preview() {
      this.$router.go(-1)
    },
    searchUser() {

    },
    confirmDeleteUser() {
      let role = localStorage.getItem('user_role');

      if(role == null || role == undefined || role != 'admin') {
        alert('회원 삭제는 관리자만 가능합니다.');
        return;
      }

      if(confirm("선택하신 사용자를 삭제하시겠습니까?\n삭제 시 복구가 불가능합니다.")) {
        for(let i of avgChart.userListDummy.data) {
          

          let input = document.getElementsByName(i.id);          

          if(input[0].checked) {
            let userData = {
            removeManager: {
              id : i.id,
            }
          };

          axios
          .post("http://210.90.145.70:12000/Account", JSON.stringify(userData), {
            headers: { "Content-Type": "application/json" },
              })
              .then(function (response) {
                if (response.status == 200) {                  
                  console.log(response);
               }
            });  
            alert(i.name + " 삭제");
          }
        }

        avgChart.requestUserList();
      }
      else {
        alert('유저 삭제 취소');
      }
    }
  }
};
</script>