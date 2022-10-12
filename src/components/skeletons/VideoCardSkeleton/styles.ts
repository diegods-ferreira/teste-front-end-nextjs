import styled from 'styled-components';
import { Box, Skeleton } from '@mui/material';

export const Container = styled(Box)`
  width: 100%;
`;

export const Media = styled(Skeleton).attrs({
  variant: 'rectangular'
})`
  width: 100%;
  height: 160px;

  @media (min-width: 769px) {
    height: 200px;
  }
`;

export const Content = styled(Box)`
  height: 180px;
  padding: 1rem;
`;
