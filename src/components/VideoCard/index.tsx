import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { CardActions } from '@mui/material';

import { Video } from '../../data/models/video';

import * as S from './styles';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const router = useRouter();

  const handleNavigateToVideoDetails = useCallback(() => {
    router.push(`/video/${video.id.videoId}`);
  }, [router, video.id.videoId]);

  return (
    <S.Container>
      <S.Media
        image={video.snippet.thumbnails.high.url}
        title={video.snippet.title}
      />

      <S.Content>
        <h1>{video.snippet.title}</h1>
        <h2>{video.snippet.channelTitle}</h2>
        <p>{video.snippet.description}</p>
      </S.Content>

      <CardActions>
        <S.DetailsButton onClick={handleNavigateToVideoDetails}>
          Detalhes do video
        </S.DetailsButton>
      </CardActions>
    </S.Container>
  );
}