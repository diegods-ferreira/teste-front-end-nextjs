import { useCallback, useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AccordionDetails, AccordionSummary, IconButton, Typography } from '@mui/material';
import { ArrowBack, ExpandMore, RemoveRedEye, ThumbDown, ThumbUp } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';

import { authOptions } from '../api/auth/[...nextauth]';

import { api } from '../../services/api';

import { Video } from '../../data/models/video';

import { ErrorFeedback } from '../../components/ErrorFeedback';
import { VideoDetailsSkeleton } from '../../components/skeletons/VideoDetailsSkeleton';

import * as S from './styles';

type VideoDetails = Omit<Video, 'id'> & {
  id: string;
  url: string;
};

export default function VideoDetails() {
  const router = useRouter();

  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const getVideoData = useCallback(async () => {
    const response = await api.get<VideoDetails>(`/videos/${router.query.videoId}`);
    return response.data;
  }, [router.query.videoId]);

  const videoDataQuery = useQuery<VideoDetails>(['videoData', router.query.videoId], async () => getVideoData(), {
    enabled: !!router.query?.videoId,
    onSuccess: (video) => {
      const url = `https://www.youtube.com/embed/${video.id}`;
      setVideo({ ...video, url });
    },
    onError: (err: any) => {
      toast(err.response.data.message, { type: 'error' });
    }
  });

  const handleToggleDescriptionAccordion = useCallback(
    (_: any, expanded: boolean) => {
      setIsDescriptionExpanded(expanded);
    },
    [],
  );

  const handleNavigateBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      <Head>
        <title>Detalhes do vídeo</title>
      </Head>

      {(() => {
        if (videoDataQuery.isLoading || videoDataQuery.isFetching) {
          return <VideoDetailsSkeleton />;
        }

        if (videoDataQuery.isError || (videoDataQuery.isSuccess && !video)) {
          return (
            <ErrorFeedback
              title="Ops..."
              message="Ocorreu um erro ao carregar os detalhes do vídeo."
              retryCallback={videoDataQuery.refetch}
              showGoBackButton
            />
          );
        }

        return (
          <>
            <S.VideoTitle>
              <IconButton
                size="large"
                color="inherit"
                aria-label="go-back"
                onClick={handleNavigateBack}
              >
                <ArrowBack />
              </IconButton>

              <Typography variant="h5" aria-label="video-title">
                {video.snippet?.title}
              </Typography>
            </S.VideoTitle>

            <S.Container>
              <S.VideoPlayer>
                <iframe
                  title="youtube-video"
                  src={video.url}
                  frameBorder="0"
                  allow="accelerometer; autoplay;"
                  allowFullScreen
                />
              </S.VideoPlayer>

              <S.VideoMeta animationDelay={0.6}>
                <h5 aria-label="channel-title">{video.snippet?.channelTitle}</h5>

                <S.VideoMeta__InteractionCounters>
                  <S.VideoMeta__Statistics aria-label="like-count">
                    <ThumbUp fontSize="small" color="primary" />
                    <Typography variant="caption">
                      {video.statistics.likeCount}
                    </Typography>
                  </S.VideoMeta__Statistics>

                  <S.VideoMeta__Statistics aria-label="dislike-count">
                    <ThumbDown fontSize="small" color="secondary" />
                    <Typography variant="caption">
                      {video.statistics.dislikeCount}
                    </Typography>
                  </S.VideoMeta__Statistics>
                </S.VideoMeta__InteractionCounters>
              </S.VideoMeta>

              <S.VideoDescription
                expanded={isDescriptionExpanded}
                onChange={handleToggleDescriptionAccordion}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="body2">Descrição</Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <p>{video.snippet?.description}</p>
                </AccordionDetails>
              </S.VideoDescription>

              <S.VideoMeta animationDelay={1}>
                <S.VideoMeta__Statistics aria-label="views-count">
                  <RemoveRedEye fontSize="small" />
                  <Typography variant="caption">
                    {video.statistics.viewCount}
                  </Typography>
                </S.VideoMeta__Statistics>
              </S.VideoMeta>
            </S.Container>
          </>
        );
      })()}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {}
  };
}
