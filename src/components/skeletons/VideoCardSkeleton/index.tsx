import { Box, Skeleton } from '@mui/material';

import styles from './styles.module.scss';

export function VideoCardSkeleton() {
  return (
    <Box className={styles.videoCardSkeletonContainer}>
      <Skeleton variant="rectangular" className={styles.videoCardMediaSkeleton} />
      
      <Box className={styles.videoCardContentSkeleton}>
        <Skeleton height="1.5rem" sx={{ marginBottom: '0.6rem' }} />
        <Skeleton width="60%" height="1rem" sx={{ marginBottom: '0.6rem' }} />
        <Skeleton height="0.75rem" />
        <Skeleton height="0.75rem" />
        <Skeleton height="0.75rem" width="40%" />
        <Skeleton height="1.5rem" width="50%" sx={{ marginTop: '1rem' }} />
      </Box>
    </Box>
  );
}