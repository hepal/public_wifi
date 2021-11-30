import styled from 'vue-styled-components';

const Container = styled('div')`
  position: relative;
  width: 100%;
  height: 108px;
 
  a{
    width: 100%;
    height: 100%;
    ${props => props.theme.layout.flexColCenter}
    text-decoration: none;
    color: inherit;
  }
  img{
    width: 32px;
    height: 32px;
    margin-bottom: 8px;
  }
  :before{
    position: absolute;
    content: '';
    top:0;
    left:0;
    width: 4px;
    height: 100%;
    transition: background-color 0.3s ease-in;
    background-color: ${props => props.isSelected?props.theme.color.ui.selected:props.theme.color.ui.enabled};
  }
`;

export default Container;