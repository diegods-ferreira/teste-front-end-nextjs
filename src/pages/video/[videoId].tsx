import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AccordionDetails, AccordionSummary, IconButton, Typography } from '@mui/material';
import { ArrowBack, ExpandMore, RemoveRedEye, ThumbDown, ThumbUp } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { authOptions } from '../api/auth/[...nextauth]';

import { api } from '../../services/api';

import { Video } from '../../data/models/video';

import { ErrorFeedback } from '../../components/ErrorFeedback';
import { VideoDetailsSkeleton } from '../../components/skeletons/VideoDetailsSkeleton';

import * as S from './styles';

export default function VideoDetails() {
  const router = useRouter();

  const [video, setVideo] = useState<Video>({} as Video);
  const [displayVideoInfo, setDisplayVideoInfo] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const fetchVideoInfoFromYoutubeApi = useCallback(async () => {
    setDisplayVideoInfo(false);

    try {
      const response = await api.get<Video>(`/videos/${router.query.videoId}`);

      setVideo(response.data);
      setDisplayVideoInfo(!!response.data);
    } catch (err) {
      toast(err.response.data.message, { type: 'error' });
      setDisplayVideoInfo(false);
      setDisplayErrorMessage(true);
    }
  }, [router.query.videoId]);

  const handleToggleDescriptionAccordion = useCallback(
    (_: any, expanded: boolean) => {
      setIsDescriptionExpanded(expanded);
    },
    [],
  );

  const handleNavigateBack = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    fetchVideoInfoFromYoutubeApi();
  }, [fetchVideoInfoFromYoutubeApi]);

  const videoUrl = useMemo(() => `https://www.youtube.com/embed/${video.id}`, [
    video.id,
  ]);

  if (displayErrorMessage) {
    return (
      <ErrorFeedback
        title="Ops..."
        message="Ocorreu um erro ao carregar os detalhes do vídeo."
        retryCallback={fetchVideoInfoFromYoutubeApi}
        showGoBackButton
      />
    );
  }

  return (
    <>
      <Head>
        <title>Detalhes do vídeo</title>
      </Head>

      {displayVideoInfo ? (
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
              {video.snippet.title}
            </Typography>
          </S.VideoTitle>

          <S.Container>
            <S.VideoPlayer>
              <iframe
                title="youtube-video"
                src={videoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay;"
                allowFullScreen
              />
            </S.VideoPlayer>

            <S.VideoMeta animationDelay={0.6}>
              <h5 aria-label="channel-title">{video.snippet.channelTitle}</h5>

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
                <p>{video.snippet.description}</p>
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
      ) : (
        <VideoDetailsSkeleton />
      )}
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
