import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > img {
    max-width: 240px;
    width: 100%;

    @media (min-width: 769px) {
      max-width: 360px;
    }
  }

  & > strong {
    font-size: 1.5em;
  }

  & > strong,
  & > span {
    text-align: center;
    margin-top: 12px;
    max-width: 300px;
  }

  & > button {
    margin-top: 12px;

    & a {
      text-decoration: none;
    }
  }
`;