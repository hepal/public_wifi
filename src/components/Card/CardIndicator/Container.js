import styled from 'vue-styled-components';

const Container = styled.div`
  position: relative;
  width: 173px;
  height: 108px;
  border-radius: 4px;
  box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  padding: 16px;
  overflow: hidden;
  margin-right: 16px;
  .top{
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 12px;
    img{
      width: 40px;
      height: 40px;
    }
  }
  .bottom{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .value{
      font-size: 36px;
      font-weight: 900;
    }
    .unit{
      font-size: 12px;
      color: ${props => props.theme.color.ui.middle2};
      margin-bottom: 8px;
    }
  }
  :before{
    position: absolute;
    content: '';
    top:0;
    left:0;
    width: 8px;
    height: 100%;
    background-color: ${props => props.isSelected?props.theme.color.ui.selected:props.theme.color.ui.enabled};
  }
`;

export default Container;