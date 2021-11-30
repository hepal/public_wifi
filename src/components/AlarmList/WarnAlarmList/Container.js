import styled from 'vue-styled-components';

const Container = styled.div`
  position: relative;
  width: 350px;
  height: 64px;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  display: flex;
  text-align: left;
  margin-bottom: 8px;
  .left{
    width: 48px;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 12px;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
    img.alert{
      position: absolute;
      top: 4px;
      right: 4px;
      width: 16px;
      height: 16px;
    }
  }
  .right{
    width: calc(100 - 48px);
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p{
      font-size: 12px;
      color: #262626;
      margin: 0px 0px 4px 0px;
      ${props => props.theme.type.size.caption}
      span{
        font-weight: bold;
      }
    }
  }
  button.close{
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    outline: none;
    border: none;
    color: #fff;
    background-color: ${props => props.theme.color.ui.middle2};
    ${props => props.theme.layout.flexColCenter}
    font-size: 10px;
  }
`;

export default Container;