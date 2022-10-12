import styled, { keyframes } from 'styled-components';
import { Button, Paper, Typography } from '@mui/material';

const coloredBackgroundAnimation = keyframes`
  from {
    background: var(--primary);
  }
  to {
    background: var(--primary-darker);
  }
`;

export const Container = styled.main`
  height: 100vh;
  padding: 2rem;

  animation: ${coloredBackgroundAnimation} 5s;
  animation-direction: alternate;
  animation-iteration-count: infinite;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SignInForm = styled(Paper).attrs({
  elevation: 3
})`
  width: 100%;
  max-width: 400px;
  padding: 2rem;

  form {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    header {
      margin-bottom: 3rem;

      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .text-field + .text-field {
      margin-top: 1.5rem;
    }

    footer {
      margin-top: 3rem;
    }
  }
`;

export const SignInForm__Logo = styled.img.attrs({
  src: '/images/logo.png',
  alt: 'iCasei'
})`
  width: 100%;
  max-width: 120px;
  object-fit: contain;
`;

export const SignInForm__Title = styled(Typography).attrs({
  variant: 'h5',
  component: 'h2'
})`
  color: var(--text);
  margin-top: 1rem;
`;

export const SignInForm__Button = styled(Button).attrs({
  type: 'submit',
  variant: 'contained',
  size: 'large'
})``;
