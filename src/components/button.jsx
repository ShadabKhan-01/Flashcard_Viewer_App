import React from 'react';
import styled from 'styled-components';

const Button = ({text}) => {
  return (
    <StyledWrapper>
      <button>{text}</button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    width: 240px;
    padding: 17px 40px;
    border-radius: 10px;
    border: 0;
    background-color: rgb(78 56 255);
    letter-spacing: 1.5px;
    font-size: 15px;
    transition: all 0.3s ease;
    box-shadow: rgb(49 46 201) 0px 10px 0px 0px;
    color: hsl(0, 0%, 100%);
    cursor: pointer;
  }

  button:hover {
    box-shadow: rgb(78 56 255) 0px 7px 0px 0px;
  }

  button:active {
    background-color: rgb(255, 56, 86);
    /*50, 168, 80*/
    box-shadow: rgb(201, 46, 70) 0px 0px 0px 0px;
    transform: translateY(5px);
    transition: 200ms;
  }`;

export default Button;
