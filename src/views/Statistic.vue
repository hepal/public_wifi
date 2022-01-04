<template>
  <Conainer>
    <h3>사용자 검색</h3>
    <Top>
      <Section>
        <label> 측정기 선택 </label>
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
        <label> 시작 날짜 </label>
        <div class="container">
          <datepicker
            ref="startDate"
            :value="state.date"
            :language="ko"
            @selected="dateSelected(this)"
          ></datepicker>
        </div>
      </SectionTiny>
      <SectionTiny>
        <label> 종료 날짜 </label>
        <div class="container">
          <datepicker
            ref="endDate"
            :value="state.date"
            :language="ko"
            @selected="dateSelected(this)"
          ></datepicker>
          <!--
          <select v-if="selectedDataType === '주평균'">
            <option v-for="(week, index) in recentWeekList" :key="index">
              {{ week }}
            </option>
          </select>
          <select v-if="selectedDataType === '월평균'">
            <option v-for="(month, index) in recentMonthList" :key="index">
              {{ month }}
            </option>
          </select>
          -->
        </div>
      </SectionTiny>
      <Button
        :onClick="
          () => {
            onClickQuery();
          }
        "
        type="PrimaryFilled"
      >
        <img :src="ic_search" alt="" />
        조회
      </Button>
    </Top>
    <h3>검색결과 7건</h3>
    <Chart ref="avgChart">
      <D3LineChart
        :config="chart_config"
        :datum="sensorGraphDummyData"
      ></D3LineChart>
    </Chart>
    <TableContainer>
      <SensorTableText ref="sensorTable" :tableData="sensorDataDummy" />
    </TableContainer>
    <ActionBar>
      <Button :onClick="() => {}" type="GrayOutlined"
        ><img :src="ic_download" alt="" />엑셀 다운로드</Button
      >
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

import axios from "axios";
import sf from "sf";
//import jsonQurty from "json-query";

import Datepicker from "vuejs-datepicker";
import { ko } from "vuejs-datepicker/dist/locale";
import ic_download from "../assets/icon/download.svg";

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

const Section = styled.div`
  width: 512px;
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
  width: 296px;
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
   select {
      width: 100%;
      height: 100%;
      border: none;
    }
  .vdp-datepicker {
    height: 100%;
    div {
      /* height: 100%; */
    }
  }
  header {
    border: none !important;
  }
  .selected {
    background-color: ${(props) =>
      props.theme.color.brand.primary700} !important;
    color: #fff !important;
    border-radius: 50%;
  }
  .vdp-datepicker__calendar {
    background-color: #ffffff;
    /* height: 700px !important; */
  }
  .cell {
    background-color: #ffffff;
  }
  .cell:hover {
    border: solid 2px ${(props) =>
      props.theme.color.brand.primary700} !important;
  }
  input {
    width: 100%;
    border: none;
    height: 48px;
    cursor: pointer;
    outline: none;
  }
  .container {
    height: 48px;
    width: calc(100% - 8px);
    padding-left: 8px;
    padding-right: 8px;
    box-sizing: c
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
  date: new Date(),
};

//기간별 통계 조회
var avgChart = null;
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
    SectionTiny,
  },
  data() {
    return {
      ic_search,
      search_name: null,
      search_id: null,
      is_delete_pop: false,
      selectedSensor: "",
      selectedDataType: "일평균",
      startDate: "",
      endDate: "",
      state,
      ko: ko,
      ic_download,
      sensorList: [
        {
          title: "초미세먼지",
          id: "pm2_5",
          isSelected: false,
        },
        {
          title: "이산화질소",
          id: "no2",
          isSelected: false,
        },
        {
          title: "오존",
          id: "o3",
          isSelected: false,
        },
        {
          title: "온도",
          id: "temp",
          isSelected: false,
        },
        {
          title: "습도",
          id: "humi",
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
      // 측정기데이터 더미
      sensorDataDummy: {
        header: [
          "NO",
          "일시",
          "측정기 타입",
          "측정지수 등급",
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
          // {
          //   date: "21.10.1 14:20:11",
          //   title: "초미세먼지",
          //   statusLevel: "좋음",
          //   alertLevel: "주의보",
          //   time: "10:00:10",
          // },
          // {
          //   date: "21.10.1 14:20:11",
          //   title: "초미세먼지",
          //   statusLevel: "좋음",
          //   alertLevel: "주의보",
          //   time: "10:00:10",
          // },
          // {
          //   date: "21.10.1 14:20:11",
          //   title: "초미세먼지",
          //   statusLevel: "좋음",
          //   alertLevel: "주의보",
          //   time: "10:00:10",
          // },
          // {
          //   date: "21.10.1 14:20:11",
          //   title: "초미세먼지",
          //   statusLevel: "좋음",
          //   alertLevel: "주의보",
          //   time: "10:00:10",
          // },
          // {
          //   date: "21.10.1 14:20:11",
          //   title: "초미세먼지",
          //   statusLevel: "좋음",
          //   alertLevel: "주의보",
          //   time: "10:00:10",
          // },
          // {
          //   date: "21.10.1 14:20:11",
          //   title: "초미세먼지",
          //   statusLevel: "좋음",
          //   alertLevel: "주의보",
          //   time: "10:00:10",
          // },
          // {
          //   date: "21.10.1 14:20:11",
          //   title: "초미세먼지",
          //   statusLevel: "좋음",
          //   alertLevel: "주의보",
          //   time: "10:00:10",
          // },
          // {
          //   date: "21.10.1 14:20:11",
          //   title: "초미세먼지",
          //   statusLevel: "좋음",
          //   alertLevel: "주의보",
          //   time: "10:00:10",
          // },
        ],
      },
      recentWeekList: [
        "12월 2주차",
        "12월 1주차",
        "11월 4주차",
        "11월 3주차",
        "11월 2주차",
        "11월 1주차",
        "10월 4주차",
        "10월 3주차",
        "10월 2주차",
        "10월 1주차",
      ],
      recentMonthList: [
        "2021년 12월",
        "2021년 11월",
        "2021년 10월",
        "2021년 9월",
        "2021년 8월",
        "2021년 7월",
        "2021년 6월",
        "2021년 5월",
        "2021년 4월",
        "2021년 3월",
      ],
      chart_config: {
        date: {
          key: "date",
          inputFormat: "%Y-%m-%d",
          outputFormat: "%Y-%m-%d",
        },

        values: ["value"],
        axis: {
          yFormat: "2s",
          xTicks: 10,
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
          value: 0.001,
          type: "dust",
          date: "2020-12-7",
        },
      ],
    };
  },
  mounted: function () {
    if (null == avgChart || undefined == avgChart) {
      return;
    }

    let jsonAlertData = null;

    jsonAlertData = {
      requestSensorAlarm: {
        activeOnly: false,
      },
    };

    axios
      .post(
        "http://210.90.145.70:12000/Sensor",
        JSON.stringify(jsonAlertData),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(function (response) {
        if (response.status == 200) {
          //alertMap.clear();

          avgChart.sensorDataDummy.data = [];
          for (let a of response.data.sensorAlarmList) {
            //    {
            //   date: "21.10.1 14:20:11",
            //   title: "초미세먼지",
            //   statusLevel: "좋음",
            //   alertLevel: "주의보",
            //   time: "10:00:10",
            // },

            let sensorType = "";

            switch (a.stype) {
              case "o3":
                sensorType = "오존";
                break;
              case "no2":
                sensorType = "이산화질소";
                break;
              case "humid":
                sensorType = "습도";
                break;
              case "pm2_5":
                sensorType = "초미세먼지";
                break;
              case "cold":
                sensorType = "한파";
                break;
              case "hot":
                sensorType = "폭염";
                break;
            }

            let alertType = "";

            if (a.atype == "watch") {
              //주의보
              alertType = "주의보";
            } else if (a.atype == "alert") {
              //경보
              alertType = "경보";
            }

            let ymd = a.regdate.split(" ")[0].split("-");

            let year = parseInt(ymd[0]);
            let month = parseInt(ymd[1]);
            let day = parseInt(ymd[2]);

            let dayString = sf("{0}년 {1}월 {2}일", year, month, day);

            let hms = a.regdate.split(" ")[1].split(":");

            let hour = parseInt(hms[0]);
            let min = parseInt(hms[1]);
            let sec = parseInt(hms[2]);

            let hourString = sf("{0}시 {1}분 {2}초", hour, min, sec);

            let d = {
              date: dayString,
              title: sensorType,
              statusLevel: "",
              alertLevel: alertType,
              time: hourString,
            };

            avgChart.sensorDataDummy.data.push(d);
          }
        }        
      });
  },
  created: function () {
    avgChart = this;
  },
  methods: {
    dateSelected(e) {},
    toggleDeletePop() {
      this.is_delete_pop = !this.is_delete_pop;
    },
    onClickQuery() {
      if (
        this.selectedSensor == undefined ||
        this.selectedDataType == undefined
      ) {
        return;
      }

      let sensorType = this.selectedSensor;

      var startDate = this.$refs.startDate.selectedDate;
      var endDate = this.$refs.endDate.selectedDate;

      //let date = new Date();

      let avgDate = "day";

      switch (this.selectedDataType) {
        case "일평균":
          avgDate = "day";
          break;
        case "주평균":
          avgDate = "week";
          break;
        case "월평균":
          avgDate = "month";
          break;
      }

      let jsonAvgBusData = {
        requestSensorAvgData: {
          sensorType: sensorType,
          avgDate: avgDate,
          beginYear: startDate.getFullYear(),
          beginMonth: startDate.getMonth() + 1,
          beginDay: startDate.getDate(),
          endYear: endDate.getFullYear(),
          endMonth: endDate.getMonth() + 1,
          endDay: endDate.getDate(),
        },
      };

      axios
        .post(
          "http://210.90.145.70:12000/Sensor",
          JSON.stringify(jsonAvgBusData),
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then(function (response) {
          if (response.status == 200) {
            console.log(response);
            let date = new Date();
            //response.data.sensorDatas.reverse(); //최신 날짜부터 정렬을 위해 뒤집는다.

            let sensorAvgDataForChartList = [];
            let sensorAvgDataForTableList = [];

            for (let i of response.data.sensorAvgDatas) {
              let value = i[sensorType];

              if (sensorType == "no2") {
                //이산화 질소는 1/1000
                value = value / 1000;
              } else if (sensorType == "o3") {
                //오존도 1/1000
                value = value / 1000;
              }

              let sensorAvgDataForChart = {
                value: value,
                type: sensorType,
                date: i.date,
              };

              let sensorAvgDataForTable = {
                date: i.date,
                title: sensorType,
                statusLevel: "좋음",
                alertLevel: "주의보",
                time: date.toString(),
              };

              sensorAvgDataForChartList.push(sensorAvgDataForChart);
              sensorAvgDataForTableList.push(sensorAvgDataForTable);
            }

            avgChart.chart_config.axis.xTicks =
              sensorAvgDataForChartList.length;
            avgChart.sensorGraphDummyData = sensorAvgDataForChartList;
            //   data: [
            // {
            //   date: "21.10.1 14:20:11",
            //   title: "초미세먼지",
            //   statusLevel: "좋음",
            //   alertLevel: "주의보",
            //   time: "10:00:10",
            // },
            //  avgChart.sensorDataDummy.data =sensorAvgDataForTableList;
          }
        });
    },
  },
};
</script>
