import styled from 'vue-styled-components';

const SideBar = styled.div`
  position: fixed;
  z-index: 999;
  width: 116px;
  height: 100%;
  top: 64px;
  left: 0px;
  background-color: ${props => props.theme.color.ui.background2};
`;

export default SideBar;