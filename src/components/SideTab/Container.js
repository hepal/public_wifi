import styled from 'vue-styled-components';

const Props = { isSelected: Boolean }
const Container = styled('div', Props)`
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 96px;
  ${props => props.theme.type.size.bttText}
  ${props => props.theme.layout.flexColCenter}
    ${props => props.theme.type.size.bttText}
    color: ${props => props.isSelected ? props.theme.color.ui.strong : props.theme.color.ui.middle2} !important;
  a{
    width: 100%;
    height: 100%;
    ${props => props.theme.layout.flexColCenter}
    ${props => props.theme.type.size.bttText}
    color: ${props => props.isSelected ? props.theme.color.ui.strong : props.theme.color.ui.middle2} !important;
    text-decoration: none;
  }
  img{
    width: 24px;
    height: 24px;
    margin-bottom: 16px;
  }
  :before{
    position: absolute;
    content: '';
    top:0;
    left:0;
    width: 5px;
    height: 100%;
    transition: background-color 0.3s ease-in;
    background-color: ${props => props.isSelected ? props.theme.color.ui.selected : props.theme.color.ui.enabled};
  }
`;

export default Container;