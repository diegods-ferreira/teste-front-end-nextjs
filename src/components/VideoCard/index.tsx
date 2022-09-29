import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, CardActions, CardContent, CardMedia } from '@mui/material';

import { Video } from '../../data/models/video';

import styles from './styles.module.scss';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const router = useRouter();

  const handleNavigateToVideoDetails = useCallback(
    (videoId: string) => {
      router.push(`/video/${videoId}`);
    },
    [router],
  );

  return (
    <Card className={styles.videoCard}>
      <CardMedia
        image={video.snippet.thumbnails.high.url}
        title={video.snippet.title}
        className={styles.videoCardMedia}
      />

      <CardContent className={styles.videoCardContent}>
        <h1>{video.snippet.title}</h1>
        <h2>{video.snippet.channelTitle}</h2>
        <p>{video.snippet.description}</p>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          color="primary"
          variant="text"
          onClick={() => {
            handleNavigateToVideoDetails(video.id.videoId);
          }}
        >
          Detalhes do video
        </Button>
      </CardActions>
    </Card>
  );
}