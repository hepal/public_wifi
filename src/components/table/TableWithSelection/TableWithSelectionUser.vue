<template>
  <table>
    <tr>
      <Header v-for="(item, index) in tableData.header" :key="index">
        {{ item }}
      </Header>
    </tr>
    <tr v-for="(item, index) in tableData.data" :key="index">
      <td>
        <input
          type="checkbox"
          :id="item.name"
          :value="item.isCheck"
        />
        <label :for="item.name">
          {{ `${index + 1}` }}
        </label>
      </td>
      <td>
        {{ item.name }}
      </td>
      <td>
        {{ item.id }}
      </td>
       <td>
        {{ item.role }}
      </td>
      <td>
        {{ item.etc }}
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
  name: "TableWithSelection",
  components: {
    Header,
  },
  props: {
    tableData: Object,
    selectedRecipientList: Array
  },
};
</script>