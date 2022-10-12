import styled, { keyframes } from 'styled-components';
import { AppBar, Button, Toolbar } from '@mui/material';

const appearFromUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled(AppBar).attrs({
  component: 'header',
  position: 'static'
})`
  padding-bottom: 1rem;
  height: 6rem;
  justify-content: flex-end;

  animation: ${appearFromUp} 0.5s;

  @media (min-width: 769px) {
    height: 7rem;
  }
`;

export const ContentContainer = styled(Toolbar)`
  align-items: flex-end;

  section {
    flex: 1;

    h5 {
      font-size: 1.2rem;
      font-weight: 700;
    }
  
    h6 {
      font-size: 1rem;
      font-weight: 400;
    }
  }
`;

export const LogOutButton = styled(Button).attrs({
  size: 'small'
})`
  color: inherit;
`;
