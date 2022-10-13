import { css, FlattenSimpleInterpolation } from 'styled-components';

const MIN_SCREEN_SIZES = {
  TABLET: '768px',
  DESKTOP: '992px',
  LARGE_DESKTOP: '1200px'
};

export const mixins = {
  screen: {
    whenTablet: (content: FlattenSimpleInterpolation) => css`
      @media screen and (min-width: ${MIN_SCREEN_SIZES.TABLET}) {
        ${content}
      }
    `,
    whenDesktop: (content: FlattenSimpleInterpolation) => css`
      @media screen and (min-width: ${MIN_SCREEN_SIZES.DESKTOP}) {
        ${content}
      }
    `,
    whenLargeDesktop: (content: FlattenSimpleInterpolation) => css`
      @media screen and (min-width: ${MIN_SCREEN_SIZES.LARGE_DESKTOP}) {
        ${content}
      }
    `,
    whenMinWidth: (screenSize: string, content: FlattenSimpleInterpolation) => css`
      @media screen and (min-width: ${screenSize}) {
        ${content}
      }
    `,
    whenMaxWidth: (screenSize: string, content: FlattenSimpleInterpolation) => css`
      @media screen and (max-width: ${screenSize}) {
        ${content}
      }
    `
  }
};
