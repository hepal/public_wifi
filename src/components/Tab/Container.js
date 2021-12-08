import styled from 'vue-styled-components';

const Props = { isSelected: Boolean }
const Container = styled('div',Props)`
  position: relative;
  width: 100%;
  height: 56px;
  ${props => props.theme.type.size.bttText}
  cursor: pointer;
  ${props => props.theme.layout.flexColCenter}
  :before{
    position: absolute;
    content: '';
    bottom:0;
    left:0;
    width: 100%;
    height: 4px;
    transition: background-color 0.2s ease-in;
    background-color: ${props => props.isSelected?props.theme.color.ui.selected:props.theme.color.ui.enabled};
  }
`;

export default Container;