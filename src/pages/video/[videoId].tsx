import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Paper, Typography } from '@mui/material';
import { ArrowBack, ExpandMore, RemoveRedEye, ThumbDown, ThumbUp } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { authOptions } from '../api/auth/[...nextauth]';

import { api } from '../../services/api';

import { Video } from '../../data/models/video';

import { ErrorFeedback } from '../../components/ErrorFeedback';
import { VideoDetailsSkeleton } from '../../components/skeletons/VideoDetailsSkeleton';

import styles from './video-details.module.scss';

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
          <div className={styles.videoTitleContainer}>
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
          </div>

          <div className={styles.pageContainer}>
            <div className={styles.videoPlayerContainer}>
              <iframe
                title="youtube-video"
                src={videoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay;"
                allowFullScreen
              />
            </div>

            <Paper elevation={3} className={[styles.videoMetaContainer, styles.delayedAnimation0_6].join(' ')}>
              <h5 aria-label="channel-title">{video.snippet.channelTitle}</h5>

              <div className={styles.videoInteractionCounters}>
                <div className={styles.videoStatistics} aria-label="like-count">
                  <ThumbUp fontSize="small" color="primary" />
                  <Typography variant="caption">
                    {video.statistics.likeCount}
                  </Typography>
                </div>

                <div className={styles.videoStatistics} aria-label="dislike-count">
                  <ThumbDown fontSize="small" color="secondary" />
                  <Typography variant="caption">
                    {video.statistics.dislikeCount}
                  </Typography>
                </div>
              </div>
            </Paper>

            <Accordion
              elevation={3}
              expanded={isDescriptionExpanded}
              onChange={handleToggleDescriptionAccordion}
              className={styles.videoDescriptionAccordion}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2">Descrição</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p>{video.snippet.description}</p>
              </AccordionDetails>
            </Accordion>

            <Paper elevation={3} className={[styles.videoMetaContainer, styles.delayedAnimation1].join(' ')}>
              <div className={styles.videoStatistics} aria-label="views-count">
                <RemoveRedEye fontSize="small" />
                <Typography variant="caption">
                  {video.statistics.viewCount}
                </Typography>
              </div>
            </Paper>
          </div>
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
