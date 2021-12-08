<template>
  <Conainer>
    <h3>사용자 검색</h3>
    <Top>
      <Section>
        <label> 센서 선택 </label>
        <div class="container">
          <div class="radio" v-for="(sensor, index) in sensorList" :key="index">
            <input
              :id="sensor.id"
              type="radio"
              v-model="selectedSensor"
              :value="sensor.id"
            />
            <label :for="sensor.id"> {{ sensor.title }} </label>
          </div>
        </div>
      </Section>
      <SectionSmall>
        <label> 데이터 구분 </label>
        <div class="container">
          <div class="radio" v-for="(type, index) in dataTypeList" :key="index">
            <input
              type="radio"
              v-model="selectedDataType"
              :id="type.title"
              :value="type.title"
            />
            <label :for="type.title"> {{ type.title }} </label>
          </div>
        </div>
      </SectionSmall>
      <SectionTiny>
        <label> 날짜 선택 </label>
        <div class="container">
           <datepicker :value="state.date" :language="ko"></datepicker>
        </div>
      </SectionTiny>
      <Button
         :onClick="()=>{}"
        type="PrimaryFilled"
      >
        <img :src="ic_search" alt="" />
        조회
      </Button>
    </Top>
    <h3>검색결과 7건</h3>
    <Chart>
      <D3LineChart
        :config="chart_config"
        :datum="sensorGraphDummyData"
      ></D3LineChart>
    </Chart>
    <TableContainer>
      <SensorTableText :tableData="sensorDataDummy" />
    </TableContainer>
    <ActionBar>
      <Button 
        :onClick="()=>{}"
        type="GrayOutlined"
      ><img :src="ic_download" alt='' />엑셀 다운로드</Button>
    </ActionBar>
    <!-- 팝업 -->
    <DeleteUserModal v-if="is_delete_pop" :onClose="toggleDeletePop" />
  </Conainer>
</template>
<script>
import styled from "vue-styled-components";
import Button from "../components/Button/Button";
import ic_search from "../assets/icon/search/white.svg";
import DeleteUserModal from "@/components/Modal/DeleteUserModal/DeleteUserModal";
import SensorTableText from "@/components/table/SensorTableText/SensorTableText";
import { D3LineChart } from "vue-d3-charts";
import Datepicker from 'vuejs-datepicker';
import {ko} from 'vuejs-datepicker/dist/locale'
import ic_download from '../assets/icon/download.svg';

const Conainer = styled.div`
  width: calc(100% - 140px - 32px);
  height: 100%;
  padding: 32px;
  padding-top: 64px;
  padding-left: 156px;
  text-align: left;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  margin-bottom: 48px;
`;

const Section = styled.div`
  width: 495px;
  margin-right: 24px;
  display: flex;
  flex-direction: column;
  .radio {
    display: flex;
    align-items: center;
    margin-right: 24px;
    input {
      margin-top: 0px;
      margin-right: 8px;
    }
  }
  label {
    ${(props) => props.theme.type.size.body2}
    color: ${(props) => props.theme.color.ui.middle};
  }
  .container {
    height: 46px;
    width: 100%;
    padding-left: 8px;
    margin-top: 8px;
    border: solid 0.5px ${(props) => props.theme.color.ui.low};
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
`;
const SectionSmall = styled.div`
  width: 280px;
  margin-right: 24px;
  display: flex;
  flex-direction: column;
  .radio {
    display: flex;
    align-items: center;
    margin-right: 24px;
    input {
      margin-top: 0px;
      margin-right: 8px;
    }
  }
  label {
    ${(props) => props.theme.type.size.body2}
    color: ${(props) => props.theme.color.ui.middle};
  }
  .container {
    height: 48px;
    width: 100%;
    padding-left: 8px;
    margin-top: 8px;
    border: solid 0.5px ${(props) => props.theme.color.ui.low};
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
`;

const SectionTiny = styled.div`
  width: 120px;
  margin-right: 24px;
  display: flex;
  flex-direction: column;
  .vdp-datepicker{
    height: 100%;
    div{
      /* height: 100%; */
    }
  }
  header{
    border: none !important;
  }
  .selected{
    background-color: ${props => props.theme.color.brand.primary700} !important;
    color: #fff !important;
    border-radius: 50%;
  }
  .vdp-datepicker__calendar{
    background-color: #ffffff;
    /* height: 700px !important; */
  }
  .cell{
    background-color: #ffffff;
  }
  .cell:hover{
    border: solid 2px ${props => props.theme.color.brand.primary700} !important;
  }
  input{
    width: 100%;
    border: none;
    height: 48px;
    cursor: pointer;
    outline: none;
  }
  .container {
    height: 48px;
    width: 100%;
    padding-left: 8px;
    margin-top: 8px;
    border: solid 0.5px ${(props) => props.theme.color.ui.low};
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
`;

const Chart = styled.div`
  width: 100%;
  height: 320px;
`;

const ActionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
`;

const TableContainer = styled.div`
  width: 100%;
  height: 320px;
  overflow-y: overlay;
`;

const state = {
  date: new Date()
}

export default {
  name: "Statistic",
  components: {
    Conainer,
    Top,
    Button,
    Section,
    TableContainer,
    ActionBar,
    DeleteUserModal,
    SectionSmall,
    SensorTableText,
    Chart,
    D3LineChart,
    Datepicker,
    SectionTiny
  },
  data() {
    return {
      ic_search,
      search_name: null,
      search_id: null,
      is_delete_pop: false,
      selectedSensor: '',
      selectedDataType: null,
      state,
      ko:ko,
      ic_download,
      sensorList: [
        {
          title: "초미세먼지",
          id:"dust",
          isSelected: false,
        },
        {
          title: "이산화질소",
          id:"no2",
          isSelected: false,
        },
        {
          title: "오존",
          id:"o3",
          isSelected: false,
        },
        {
          title: "온도",
          id:"temperature",
          isSelected: false,
        },
        {
          title: "습도",
          id:"humid",
          isSelected: false,
        },
      ],
      dataTypeList: [
        {
          title: "일평균",
          isSelected: false,
        },
        {
          title: "주평균",
          isSelected: false,
        },
        {
          title: "월평균",
          isSelected: false,
        },
      ],
      // 센서데이터 더미
      sensorDataDummy: {
        header: [
          "NO",
          "일시",
          "센서 타입",
          "센서지수 등급",
          "경보단계",
          "발행시간",
        ],
        data: [
          {
            date: "21.10.1 14:20:11",
            title: "초미세먼지",
            statusLevel: "좋음",
            alertLevel: "주의보",
            time: "10:00:10",
          },
          {
            date: "21.10.1 14:20:11",
            title: "초미세먼지",
            statusLevel: "좋음",
            alertLevel: "주의보",
            time: "10:00:10",
          },
          {
            date: "21.10.1 14:20:11",
            title: "초미세먼지",
            statusLevel: "좋음",
            alertLevel: "주의보",
            time: "10:00:10",
          },
          {
            date: "21.10.1 14:20:11",
            title: "초미세먼지",
            statusLevel: "좋음",
            alertLevel: "주의보",
            time: "10:00:10",
          },
          {
            date: "21.10.1 14:20:11",
            title: "초미세먼지",
            statusLevel: "좋음",
            alertLevel: "주의보",
            time: "10:00:10",
          },
          {
            date: "21.10.1 14:20:11",
            title: "초미세먼지",
            statusLevel: "좋음",
            alertLevel: "주의보",
            time: "10:00:10",
          },
          {
            date: "21.10.1 14:20:11",
            title: "초미세먼지",
            statusLevel: "좋음",
            alertLevel: "주의보",
            time: "10:00:10",
          },
          {
            date: "21.10.1 14:20:11",
            title: "초미세먼지",
            statusLevel: "좋음",
            alertLevel: "주의보",
            time: "10:00:10",
          },
          {
            date: "21.10.1 14:20:11",
            title: "초미세먼지",
            statusLevel: "좋음",
            alertLevel: "주의보",
            time: "10:00:10",
          },
        ],
      },
      chart_config: {
        date: {
          key: "date",
          inputFormat: "%Y-%m-%d",
          outputFormat: "%Y-%m-%d",
        },

        values: ["value"],
        axis: {
          yTicks: 4,
        },
        color: {
          default: "#222f3e",
          current: "#41B882",
        },
      },
      sensorGraphDummyData: [
        {
          value: 0.0001,
          type: "dust",
          date: "2020-12-1",
        },
        {
          value: 0.0004,
          type: "dust",
          date: "2020-12-2",
        },
        {
          value: 0.00013,
          type: "dust",
          date: "2020-12-3",
        },
        {
          value: 0.0003,
          type: "dust",
          date: "2020-12-4",
        },
        {
          value: 0.0007,
          type: "dust",
          date: "2020-12-5",
        },
        {
          value: 0.0002,
          type: "dust",
          date: "2020-12-6",
        },
        {
          value: 0.0010,
          type: "dust",
          date: "2020-12-7",
        },
      ],
    };
  },
  methods: {
    toggleDeletePop() {
      this.is_delete_pop = !this.is_delete_pop;
    },
  },
};
</script>