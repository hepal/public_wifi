import styled from 'vue-styled-components';

const Props = { bg: String };

const Container = styled('div',Props)`
  position: fixed;
  top: 0;
  left: 0;
  /*width: 100%;
  height: 100%;*/
  background-image: ${props => `url(${props.bg})`};
  background-size: cover;
  background-color: ${props => props.color};
  z-index: 1;
`;

export default Container;