<template>
  <table>
    <tr>
      <Header v-for="(item, index) in tableData.header" :key="index">
        {{ item }}
      </Header>
    </tr>
    <tr v-for="(item, index) in tableData.data" :key="index">
      <td>
        {{ index + 1 }}
      </td>
      <td>
        {{ item.date }}
      </td>
      <td>
        {{ item.title }}
      </td>
      <td>
        {{ item.satusLevel }}
      </td>
      <td>
        {{ item.alertLevel }}
      </td>
      <td>
        {{ item.time }}
      </td>
    </tr>
  </table>
</template>
<script>
import styled from "vue-styled-components";

const Header = styled.th`
  position: sticky;
  top: 0;
  z-index: 9;
`;

export default {
  name: "SensorTableText",
  components: {
    Header,
  },
  props: {
    tableData: Object,
    selectedRecipientList: Array
  },
};
</script>