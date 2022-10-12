import { Skeleton } from '@mui/material';

import * as S from './styles';

export function VideoDetailsSkeleton() {
  return (
    <S.Container>
      <S.VideoEmbed />

      <Skeleton height="5.5rem" />
      <Skeleton height="5.5rem" />
      <Skeleton height="5.5rem" />
    </S.Container>
  );
}