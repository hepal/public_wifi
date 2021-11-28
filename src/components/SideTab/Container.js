import styled from 'vue-styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 108px;
  ${props => props.theme.layout.flexColCenter}
  img{
    width: 32px;
    height: 32px;
  }
  :before{
    position: absolute;
    content: '';
    top:0;
    left:0;
    width: 4px;
    height: 100%;
    background-color: ${props => props.isSelected?props.theme.color.ui.selected:props.theme.color.ui.enabled};
  }
`;

export default Container;