import styled, { keyframes } from 'styled-components';
import { Button, Card, CardContent, CardMedia } from '@mui/material';

const videoCardAppearanceAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const Container = styled(Card)`
  width: 100%;
  height: fit-content;
  animation: ${videoCardAppearanceAnimation} 0.2s;

  & + div {
    margin-top: 12px;

    @media (min-width: 769px) {
      margin-top: 0;
    }
  }
`;

export const Media = styled(CardMedia)`
  height: 160px;

  @media (min-width: 993px) {
    height: 200px;
  }
`;

export const Content = styled(CardContent)`
  height: 135px;
  color: var(--text);

  & > h1 {
    max-width: 100%;
    font-size: 18px;
    margin-bottom: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  & > h2 {
    max-width: 100%;
    font-size: 14px;
    margin-bottom: 12px;
  }

  & > p {
    max-width: 100%;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
`;

export const DetailsButton = styled(Button).attrs({
  size: 'small',
  color: 'primary',
  variant: 'text'
})``;
