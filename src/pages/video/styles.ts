import styled, { css, keyframes } from 'styled-components';
import { Accordion, Paper } from '@mui/material';

interface VideoMetaProps {
  animationDelay: number;
}

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

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const VideoTitle = styled.div`
  padding: 1rem;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  @media (min-width: 1200px) {
    max-width: 320px;
    margin-top: 7rem;

    justify-content: flex-start;

    position: absolute;
    top: 0;
    left: 0;
  }

  @media (min-width: 1400px) {
    max-width: 400px;
  }

  @media (min-width: 1600px) {
    max-width: 560px;
  }

  button {
    margin-right: 1rem;
  }

  h5 {
    margin-top: 0.3rem;
    font-weight: 700;

    animation: appearFromLeft 0.8s;
    animation-delay: 0.2s;
    animation-fill-mode: backwards;
  }
`;

export const Container = styled.div`
  max-width: 600px;
  width: 100%;
  padding: 1rem;
  margin: 0 auto;

  @media (min-width: 769px) {
    margin-top: 1rem;
  }
`;

export const VideoPlayer = styled.div`
  width: 100%;
  margin-top: 1rem;

  animation: ${appearFromLeft} 0.8s;
  animation-delay: 0.4s;
  animation-fill-mode: backwards;

  & > iframe {
    width: 100%;
    aspect-ratio: 16/9;
  }
`;

export const VideoMeta = styled(Paper).attrs({
  elevation: 3
})<VideoMetaProps>`
  width: 100%;
  margin: 1rem 0;
  padding: 1rem;

  display: flex;
  align-items: flex-start;

  animation: ${appearFromLeft} 0.8s;
  animation-fill-mode: backwards;

  ${({ animationDelay }) => animationDelay && css`
    animation-delay: ${animationDelay}s;
  `}

  & > h5 {
    flex: 1;
    display: flex;
    align-items: center;
  }
`;

export const VideoMeta__InteractionCounters = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
`;

export const VideoMeta__Statistics = styled.div`
  display: flex;
  align-items: center;

  & > svg {
    margin-right: 0.5rem;
  }

  & + div {
    margin-left: 1rem;
  }
`;

export const VideoDescription = styled(Accordion).attrs({
  elevation: 3
})`
  border-radius: 4px;

  animation: ${appearFromLeft} 0.8s;
  animation-delay: 0.8s;
  animation-fill-mode: backwards;

  &::before {
    display: none;
  }

  p {
    font-size: 0.75rem;

    @media (min-width: 769px) {
      font-size: 0.875rem;
    }
  }
`;
