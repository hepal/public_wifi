<template>
  <CustomThemeProvider>
    <Nav />
    <div id="app">
      <router-view />
    </div>
  </CustomThemeProvider>
</template>
<script>
import CustomThemeProvider from "./ThemeProvider";
import theme from "./assets/theme/theme";
import Nav from "./components/Nav/Nav";
import { injectGlobal } from "vue-styled-components";

injectGlobal`
	@font-face {
	  font-family: 'Operator Mono';
	  src: url('../fonts/Operator-Mono.ttf');
	}
  body{
    margin: 0px;
    color: ${theme.color.ui.middle1};
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 400;
  }
  h1{
    ${theme.type.size.h1};
    ${theme.type.weight.prd.bold};
    margin-top:0px;
    margin-bottom: 24px;
  }
  h3{
    ${theme.type.size.h3};
     margin-top:0px;
    margin-bottom: 24px;
  }
  table{
    width: 100%;
    margin-bottom: 48px;
  }
  tr,th,td{
    height: 48px;
    text-align: left;
    padding-left: 16px;
  }
  th{
    background-color: ${theme.color.brand.primary200};
    color: ${theme.color.brand.primary700};
    word-break: keep-all;
    white-space: pre-line;
    text-align: left;
     ${theme.type.size.caption}
  }
  td{
    background-color: ${theme.color.ui.white500};
    color: ${theme.color.ui.strong};
    ${theme.type.size.body2}
  }
  button{
    cursor: pointer;
    position: relative;
    overflow: hidden;
    *{
      z-index: 9;
    }
  }
  button:hover:before{
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.04);
  }
`;
export default {
  name: "App",
  components: {
    CustomThemeProvider,
    Nav,
  }
};
</script>
<style>
html,
body {
  width: 100%;
  height: 100%;
}
button{
  color: inherit;
  background-color: inherit;
  outline: none;
  border: inherit;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
