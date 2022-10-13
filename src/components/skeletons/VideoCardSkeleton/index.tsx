import { Skeleton } from '@mui/material';

import * as S from './styles';

export function VideoCardSkeleton() {
  return (
    <S.Container>
      <S.Media />
      
      <S.Content>
        <Skeleton height="1.5rem" sx={{ marginBottom: '0.6rem' }} />
        <Skeleton width="60%" height="1rem" sx={{ marginBottom: '0.6rem' }} />
        <Skeleton height="0.75rem" />
        <Skeleton height="0.75rem" />
        <Skeleton height="0.75rem" width="40%" />
        <Skeleton height="1.5rem" width="50%" sx={{ marginTop: '1rem' }} />
      </S.Content>
    </S.Container>
  );
}