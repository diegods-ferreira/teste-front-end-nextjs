import styled, { css, keyframes } from 'styled-components';
import { InputBase, Paper } from '@mui/material';

interface SearchFormProps {
  animateToTop: boolean;
}

export const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 6rem);
  background: var(--background);

  @media (min-width: 769px) {
    min-height: calc(100vh - 7rem);
  }
`;

export const InnerContainer = styled.div`
  width: 100%;
  padding: 1rem;
`;

const formAppearanceAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const formSubmitAnimation = keyframes`
  from {
    margin-top: calc(50vh - 48px);
  }
  to {
    margin-top: 0;
  }
`;

export const SearchForm = styled.div<SearchFormProps>`
  width: 100%;
  height: fit-content;
  margin-top: calc(50vh - 48px);

  animation: ${formAppearanceAnimation} 0.5s;

  display: flex;
  align-items: center;
  justify-content: center;

  ${({ animateToTop }) => animateToTop && css`
    animation: ${formSubmitAnimation} 0.5s forwards;
  `}
`;

export const SearchForm__Wrapper = styled(Paper)`
  width: 100%;
  max-width: 560px;
`;

export const SearchForm__Form = styled.form`
  width: 100%;
  display: flex;
`;

export const SearchForm__Input = styled(InputBase)`
  flex: 1;
  margin-left: 1rem;
`;

export const VideoCardsGrid = styled.div`
  flex: 1;
  max-width: 1200px;
  margin-top: 1rem;

  @media (min-width: 769px) {
    margin: 1rem auto 0px;
    
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
  }
`;
