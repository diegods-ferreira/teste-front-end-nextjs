
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Backdrop, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, IconButton, InputBase, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useInView } from 'react-intersection-observer';

import { authOptions } from './api/auth/[...nextauth]';

import { api } from '../services/api';

import { useVideosList } from '../contexts/VideoListContext';

import { Video } from '../data/models/video';

import { ErrorFeedback } from '../components/ErrorFeedback';
import { VideoCardSkeleton } from '../components/skeletons/VideoCardSkeleton';

import styles from './home.module.scss';

interface ApiGetVideosResponse {
  videos: Video[];
  nextPageToken: string;
}

export default function Home() {
  const router = useRouter();

  const {
    videosList,
    searchedTerm,
    nextPageToken,
    hasStoredSearch,
    setNewVideosList,
    addVideos,
    updateSearchedTerm,
    updateNextPageToken,
  } = useVideosList();

  const { ref: loadMoreVideosElementRef, inView: isLoadMoreVideosElementInView } = useInView({
    threshold: 0.3
  });

  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shouldAnimateSearchForm, setShouldAnimateSearchForm] = useState(false);

  const handleSearchTermInputTextChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateSearchedTerm(event.target.value);
    },
    [updateSearchedTerm],
  );

  const handleSearchFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!searchedTerm) {
        toast('É preciso preencher o campo de pesquisa.', { type: 'warning' });
        return;
      }

      setIsLoading(true);

      try {
        const response = await api.get<ApiGetVideosResponse>('/videos', {
          params: { searchedTerm }
        });

        const { videos, nextPageToken } = response.data;

        setNewVideosList(
          videos.map(video => ({ ...video, key: video.id.videoId })),
        );

        updateNextPageToken(nextPageToken);

        setShouldAnimateSearchForm(true);
        setIsSearched(true);
      } catch (err) {
        toast('Erro ao pesquisar.', { type: 'error' });
        console.log(err.response.data);
      } finally {
        setIsLoading(false);
      }
    },
    [searchedTerm, setNewVideosList, updateNextPageToken],
  );

  const loadMoreVideos = useCallback(async () => {
    setIsLoadingMore(true);

    try {
      const response = await api.get<ApiGetVideosResponse>('/videos', {
        params: { searchedTerm, pageToken: nextPageToken }
      });

      addVideos(
        response.data.videos.map(video => ({
          ...video,
          key: `${nextPageToken}__${video.id.videoId}`,
        })),
      );

      updateNextPageToken(response.data.nextPageToken);

      setIsSearched(true);
    } catch (err) {
      toast('Erro ao pesquisar.', { type: 'error' });
      console.log(err.response.data);
    } finally {
      setIsLoadingMore(false);
    }
  }, [addVideos, nextPageToken, searchedTerm, updateNextPageToken]);

  const handleNavigateToVideoDetails = useCallback(
    (videoId: string) => {
      router.push(`/video/${videoId}`);
    },
    [router],
  );

  const formContainerClassName = useMemo(() => {
    const classes = [styles.formContainer];

    if (shouldAnimateSearchForm || hasStoredSearch) {
      classes.push(styles.animate);
    }

    return classes.join(' ');
  }, [hasStoredSearch, shouldAnimateSearchForm]);

  useEffect(() => {
    if (isLoadMoreVideosElementInView && !isLoadingMore) {
      loadMoreVideos();
    }
  }, [isLoadMoreVideosElementInView, isLoadingMore, loadMoreVideos]);

  useEffect(() => {
    setShouldAnimateSearchForm(isSearched);
  }, [isSearched]);

  return (
    <>
      <Head>
        <title>Lista de vídeos</title>
      </Head>

      <div className={styles.pageContainer}>
        <div className={styles.innerContainer}>
          <div className={formContainerClassName}>
            <Paper sx={{ maxWidth: 560, width: '100%' }}>
              <form className={styles.form} onSubmit={handleSearchFormSubmit}>
                <InputBase
                  placeholder="Pesquisar"
                  onChange={handleSearchTermInputTextChange}
                  defaultValue={searchedTerm}
                />

                <IconButton type="submit" aria-label="search">
                  <Search />
                </IconButton>
              </form>
            </Paper>
          </div>

          {(isSearched || hasStoredSearch) && !videosList.length && (
            <ErrorFeedback
              title="Não encontramos vídeos com o termo buscado."
              message="Utilize outras palavras-chave."
            />
          )}

          {(isSearched || hasStoredSearch) && !!videosList.length && (
            <div className={styles.videoCardsContainer}>
              {videosList.map(video => (
                <Card key={video.key} className={styles.videoCard}>
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
              ))}

              <Card ref={loadMoreVideosElementRef} className={styles.videoCard}>
                <VideoCardSkeleton />
              </Card>
            </div>
          )}
        </div>

        <Backdrop style={{ zIndex: 1 }} open={isLoading}>
          <CircularProgress color="primary" />
        </Backdrop>
      </div>
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
