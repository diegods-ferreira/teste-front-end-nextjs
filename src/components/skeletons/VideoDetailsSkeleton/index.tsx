import { Box, Skeleton } from '@mui/material';

import styles from './styles.module.scss';

export function VideoDetailsSkeleton() {
  return (
    <Box className={styles.videoDetailsSkeletonContainer}>
      <Skeleton variant="rectangular" className={styles.videoEmbedSkeleton} />

      <Skeleton height="5.5rem" />
      <Skeleton height="5.5rem" />
      <Skeleton height="5.5rem" />
    </Box>
  );
}