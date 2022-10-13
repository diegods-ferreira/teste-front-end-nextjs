import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > img {
    max-width: 240px;
    width: 100%;
    
    ${({ theme }) => theme.mixins.screen.whenTablet(css`
      max-width: 360px;
    `)}
  }

  & > strong {
    font-size: 1.5em;
  }

  & > strong,
  & > span {
    color: var(--gray-900);
    text-align: center;
    margin-top: 12px;
    max-width: 300px;
  }

  & > button {
    margin-top: 12px;
    background-color: var(--blue-700);

    & a {
      text-decoration: none;
    }
  }
`;
