import styled from 'styled-components';
import { AppBar, Button, Toolbar } from '@mui/material';

export const Container = styled(AppBar).attrs({
  component: 'header',
  position: 'static'
})`
  padding-bottom: 1rem;
  height: 6rem;
  justify-content: flex-end;

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
