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
import Nav from "./components/Nav/Nav";
import { injectGlobal } from "vue-styled-components";

injectGlobal`
	@font-face {
	  font-family: 'Operator Mono';
	  src: url('../fonts/Operator-Mono.ttf');
	}


  body{
    margin: 0px;
    color: ${(props) => props.theme.color.ui.low};
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 400;
  }
`;
export default {
  name: "App",
  components: {
    CustomThemeProvider,
    Nav,
  },
};
</script>
<style>
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
