
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { Backdrop, Box, Card, CircularProgress, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

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
  const [shouldAnimateSearchForm, setShouldAnimateSearchForm] = useState(false);

  const getVideos = useCallback(async (page: number) => {
    if (!searchedTerm) {
      return;
    }

    const params: Record<string, string> = { searchedTerm };

    if (page > 1) {
      params.pageToken = nextPageToken;
    }

    const response = await api.get<ApiGetVideosResponse>('/videos', { params });

    if (page > 1) {
      addVideos(response.data.videos.map(video => ({
        ...video,
        key: `${nextPageToken}__${video.id.videoId}`,
      })));
    } else {
      setNewVideosList(response.data.videos.map(video => ({
        ...video,
        key: video.id.videoId
      })));
    }

    updateNextPageToken(response.data.nextPageToken);

    setIsSearched(true);

    return response.data.videos;
  }, [addVideos, nextPageToken, searchedTerm, setNewVideosList, updateNextPageToken]);

  const videosQuery = useInfiniteQuery(
    ['videos-list'],
    ({ pageParam = 1 }) => getVideos(pageParam),
    {
      enabled: isSearched,
      getNextPageParam: (lastPage: any, allPages) => {
        return (lastPage?.data?.length || 0) <= 9 ? allPages.length + 1 : undefined;
      },
      onError: (err: any) => {
        toast(err.response.data.message, { type: 'error' });
        console.log(err.response.data);
      }
    }
  );

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

      videosQuery.refetch();
    },
    [searchedTerm, videosQuery],
  );

  useEffect(() => {
    if (
      isLoadMoreVideosElementInView &&
      !videosQuery.isLoading &&
      !videosQuery.isFetching &&
      !videosQuery.isFetchingNextPage &&
      nextPageToken
    ) {
      videosQuery.fetchNextPage();
    }
  }, [
    isLoadMoreVideosElementInView,
    nextPageToken,
    videosQuery.isLoading,
    videosQuery.isFetching,
    videosQuery.isFetchingNextPage,
    videosQuery.fetchNextPage
  ]);

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

                <IconButton
                  type="submit"
                  aria-label="search"
                  disabled={videosQuery.isFetching || videosQuery.isFetchingNextPage}
                >
                  {videosQuery.isFetching || videosQuery.isFetchingNextPage
                    ? <CircularProgress color="inherit" size="1.5rem" />
                    : <Search />}
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

                {videosQuery.isFetchingNextPage && !videosQuery.isError && (
                  <Card>
                    <VideoCardSkeleton />
                  </Card>
                )}
              </S.VideoCardsGrid>

              {!videosQuery.isFetchingNextPage && !videosQuery.isError && (
                <Box ref={loadMoreVideosElementRef} sx={{ height: '2rem' }} />
              )}

              {!!videosQuery.isError && (
                <ErrorFeedback
                  title="Ocorreu um erro."
                  message="Não foi possível buscar os vídeos."
                  retryCallback={videosList.length ? videosQuery.fetchNextPage : videosQuery.refetch}
                />
              )}
            </>
          )}
        </S.InnerContainer>

        <Backdrop style={{ zIndex: 1 }} open={videosQuery.isLoading && isSearched}>
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
