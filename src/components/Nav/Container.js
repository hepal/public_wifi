import styled from 'vue-styled-components';

const Container = styled.div`
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 64px;
  align-items: center;
  background-color: ${props => props.theme.color.ui.background2};
  z-index: 999;
  .section{
    display: flex;
    height: 100%;
    align-items: center;
    img{
      margin-right: 24px;
    }
  }
  .section.left{
    padding-left: 24px;
  }
  .section.right{
    padding-right: 12px;
  }
  button{
    position: relative;
    width: 48px;
    height: 48px;
    ${props => props.theme.layout.flexColCenter}
    border: none;
    background: none;
    img{
      margin:0 !important;
    }
  }
  @media only screen and (max-width: 480px) {
    display: none;
  }
`;

export default Container;