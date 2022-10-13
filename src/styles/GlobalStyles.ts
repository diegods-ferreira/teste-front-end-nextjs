import { createGlobalStyle, css } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  ${({ theme }) => theme.mixins.screen.whenMaxWidth('1080px', css`
    html {
      font-size: 93.75%;
    }
  `)}

  ${({ theme }) => theme.mixins.screen.whenMaxWidth('720px', css`
    html {
      font-size: 87.5%;
    }
  `)}

  body {
    background: var(--gray-100);
    color: var(--gray-900);
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, select, button {
    font: 400 1rem "Roboto", sans-serif;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  :root {
    ${props => {
      const themeColors = props.theme.colors;
      let append = '';
      Object.entries(themeColors).forEach(([prop, value]) => {
        append += `--${prop}: ${value};`
      });
      return append;
    }}
  }
`;