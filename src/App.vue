<template>
  <CustomThemeProvider>
    <div id="app">
      <Home />
    </div>
  </CustomThemeProvider>
</template>
<script>
import CustomThemeProvider from "./ThemeProvider";
import theme from "./assets/theme/theme";
import Home from "./views/Home";
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
  ::-webkit-scrollbar {
    width: 12px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px ${theme.color.ui.white500}; 
    border-radius: 0px;
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${theme.color.brand.secondary100}; 
    border-radius: 0px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #fff;
  }
  a{
    text-decoration: none;
    color: inherit;
  }

.wifi-symbol{
  /* display:none; */
  
  $circleColor: #FFFFCC;
  $size: 40px;
  
  [foo], & {
    display:block;
    /* position:absolute; */
    top: 50%;
    display:inline-block;
    width:$size;
    height:$size;
    margin-top: 0 - $size - $size*0.25;
    
    -ms-transform:rotate(-45deg) translate(-100px);
    -moz-transform:rotate(-45deg) translate(-100px);
    -o-transform:rotate(-45deg) translate(-100px);
    -webkit-transform:rotate(-45deg) translate(-100px);
     transform:rotate(-45deg) translate(-100px);
   }
  .wifi-circle {
    box-sizing:border-box;
    -moz-box-sizing:border-box;
    display:block;
    width:100%;
    height:100%;
    font-size:$size/7;
    position:absolute;
    bottom:0;
    left:0;
    border-color: $circleColor;
    border-style:solid;
    border-width:1em 1em 0 0 ;
    -webkit-border-radius:0 100% 0 0;
    border-radius:0 100% 0 0;
    
    opacity:0;
    -o-animation:wifianimation 3s infinite;
    -moz-animation:wifianimation 3s infinite;
    -webkit-animation:wifianimation 3s infinite;
    animation:wifianimation 3s infinite;
    
    &.first {
      -o-animation-delay:800ms;
      -moz-animation-delay:800ms;
      -webkit-animation-delay:800ms;
      animation-delay:800ms;
    }
    &.second {
      width:5em;
      height:5em;
      -o-animation-delay:400ms;
      -moz-animation-delay:400ms;
      -webkit-animation-delay:400ms;
      animation-delay:400ms;
    }
    &.third {
      width: 3em;
      height: 3em;
    }
    &.fourth {
      width: 1em;
      height: 1em;
      opacity: 1;
      background-color: ${props=>props.theme.color.brand.primary800};
      -o-animation:none;
      -moz-animation:none;
      -webkit-animation:none;
      animation:none;
    }
  }
}


@-o-keyframes wifianimation 
{
  0% { opacity: 0.4 }
  5% { opactiy: 1 }
  6% { opactiy: 0.1 }
  100% { opactiy: 0.1; }
}
@-moz-keyframes wifianimation 
{
  0% { opacity: 0.4 }
  5% { opactiy: 1 }
  6% { opactiy: 0.1 }
  100% { opactiy: 0.1; }
}
@-webkit-keyframes wifianimation 
{
  0% { opacity: 0.4 }
  5% { opactiy: 1 }
  6% { opactiy: 0.1 }
  100% { opactiy: 0.1; }
}
  
`;
export default {
  name: "App",
  components: {
    CustomThemeProvider,
    Home
  },
};
</script>
<style>
html,
body {
  width: 100%;
  height: 100%;
  overflow: overlay;
  overflow-x: hidden;
}
button {
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

</style>
