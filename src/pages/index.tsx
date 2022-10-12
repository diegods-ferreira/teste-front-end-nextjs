
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { Backdrop, Box, Card, CircularProgress, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useInView } from 'react-intersection-observer';

import { authOptions } from './api/auth/[...nextauth]';

import { api } from '../services/api';

import { useVideosList } from '../contexts/VideoListContext';

import { Video } from '../data/models/video';

import { ErrorFeedback } from '../components/ErrorFeedback';
import { VideoCardSkeleton } from '../components/skeletons/VideoCardSkeleton';
import { VideoCard } from '../components/VideoCard';

import * as S from './styles';

interface ApiGetVideosResponse {
  videos: Video[];
  nextPageToken: string;
}

export default function Home() {
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
  const [showErrorFeedback, setShowErrorFeedback] = useState(false);
  const [shouldAnimateSearchForm, setShouldAnimateSearchForm] = useState(false);

  const handleSearchTermInputTextChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateSearchedTerm(event.target.value);
    },
    [updateSearchedTerm],
  );

  const loadVideos = useCallback(async () => {
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
      setShowErrorFeedback(false);
    } catch (err) {
      toast(err.response.data.message, { type: 'error' });
      setShowErrorFeedback(true);
      console.log(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [searchedTerm, setNewVideosList, updateNextPageToken]);

  const handleSearchFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!searchedTerm) {
        toast('É preciso preencher o campo de pesquisa.', { type: 'warning' });
        return;
      }

      loadVideos();
    },
    [searchedTerm, loadVideos],
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
      setShowErrorFeedback(false);
    } catch (err) {
      toast(err.response.data.message, { type: 'error' });
      setShowErrorFeedback(true);
      console.log(err.response.data);
    } finally {
      setIsLoadingMore(false);
    }
  }, [addVideos, nextPageToken, searchedTerm, updateNextPageToken]);

  useEffect(() => {
    if (isLoadMoreVideosElementInView && !isLoadingMore) {
      loadMoreVideos();
    }
  }, [isLoadMoreVideosElementInView, isLoadingMore, loadMoreVideos]);

  useEffect(() => {
    setIsSearched(!!videosList.length);
  }, [videosList]);

  useEffect(() => {
    setShouldAnimateSearchForm(isSearched);
  }, [isSearched]);

  return (
    <>
      <Head>
        <title>Lista de vídeos</title>
      </Head>

      <S.Container>
        <S.InnerContainer>
          <S.SearchForm animateToTop={shouldAnimateSearchForm}>
            <S.SearchForm__Wrapper>
              <S.SearchForm__Form onSubmit={handleSearchFormSubmit}>
                <S.SearchForm__Input
                  placeholder="Pesquisar"
                  onChange={handleSearchTermInputTextChange}
                  value={searchedTerm || ''}
                />

                <IconButton type="submit" aria-label="search">
                  <Search />
                </IconButton>
              </S.SearchForm__Form>
            </S.SearchForm__Wrapper>
          </S.SearchForm>

          {(isSearched || hasStoredSearch) && !videosList.length && (
            <ErrorFeedback
              title="Não encontramos vídeos com o termo buscado."
              message="Utilize outras palavras-chave."
            />
          )}

          {(isSearched || hasStoredSearch) && !!videosList.length && (
            <>
              <S.VideoCardsGrid>
                {videosList.map(video => <VideoCard key={video.key} video={video} />)}

                {isLoadingMore && !showErrorFeedback && (
                  <Card>
                    <VideoCardSkeleton />
                  </Card>
                )}
              </S.VideoCardsGrid>

              {!isLoadingMore && !showErrorFeedback && (
                <Box ref={loadMoreVideosElementRef} sx={{ height: '2rem' }} />
              )}

              {!!showErrorFeedback && (
                <ErrorFeedback
                  title="Ocorreu um erro."
                  message="Não foi possível buscar os vídeos."
                  retryCallback={videosList.length ? loadMoreVideos : loadVideos}
                />
              )}
            </>
          )}
        </S.InnerContainer>

        <Backdrop style={{ zIndex: 1 }} open={isLoading}>
          <CircularProgress color="primary" />
        </Backdrop>
      </S.Container>
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
