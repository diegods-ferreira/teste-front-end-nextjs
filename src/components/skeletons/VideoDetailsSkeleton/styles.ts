import styled from 'styled-components';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';

export const Container = styled(Box)`
  max-width: 600px;
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
`;

export const VideoEmbed = styled(Skeleton).attrs({
  variant: 'rectangular'
})`
  width: 100%;
  height: 100%;
  aspect-ratio: 16/9;
`;
