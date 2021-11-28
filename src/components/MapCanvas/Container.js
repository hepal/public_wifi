import styled from 'vue-styled-components';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: ${props => `url(${props.bg})`};
  /* background-color: ${props => props.theme.color.ui.strong}; */
  background-size: cover;
`;

export default Container;