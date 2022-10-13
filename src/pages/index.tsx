
import { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Backdrop, Box, Card, CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';

import { requireAuthentication } from '../hocs/require-authentication';

import { api } from '../services/api';

import { useVideosList } from '../contexts/VideoListContext';

import { Video } from '../data/models/video';

import { ControlledSearchInput } from '../components/ControlledSearchInput';
import { ErrorFeedback } from '../components/ErrorFeedback';
import { VideoCardSkeleton } from '../components/skeletons/VideoCardSkeleton';
import { VideoCard } from '../components/VideoCard';

import * as S from './styles';

interface GetVideosParams {
  searchTerm: string;
  pageToken?: string;
}

interface ApiGetVideosResponse {
  videos: Video[];
  nextPageToken: string;
}

interface SearchFormData {
  searchTerm: string;
}

type FetchStatus = 'IDLE' | 'FETCHING' | 'FETCHING_NEXT_PAGE' | 'SUCCESS' | 'ERROR';

export default function Home() {
  const {
    videosList,
    searchedTerm,
    nextPageToken,
    hasStoredSearch,
    setNewVideosList,
    addVideos,
    updateSearchedTerm,
    updateNextPageToken
  } = useVideosList();

  const { ref: loadMoreVideosElementRef, inView: isLoadMoreVideosElementInView } = useInView({
    threshold: 0.3
  });

  const [isSearched, setIsSearched] = useState(false);
  const [shouldAnimateSearchForm, setShouldAnimateSearchForm] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('IDLE');

  const searchForm = useForm<SearchFormData>({
    defaultValues: { searchTerm: searchedTerm || '' }
  });

  const getVideos = useCallback(async ({ searchTerm, pageToken }: GetVideosParams) => {
    if (
      !searchTerm ||
      fetchStatus === 'FETCHING' ||
      fetchStatus === 'FETCHING_NEXT_PAGE'
    ) {
      return;
    }

    const params: Record<string, string> = { searchedTerm: searchTerm };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    setFetchStatus(pageToken ? 'FETCHING_NEXT_PAGE' : 'FETCHING');

    try {
      const response = await api.get<ApiGetVideosResponse>('/videos', { params });

      if (pageToken) {
        addVideos(response.data.videos.map(video => ({
          ...video,
          key: `${pageToken}__${video.id.videoId}`,
        })));
      } else {
        setNewVideosList(response.data.videos.map(video => ({
          ...video,
          key: video.id.videoId
        })));
      }

      if (response.data.nextPageToken) {
        updateNextPageToken(response.data.nextPageToken);
      } else {
        updateNextPageToken('');
      }

      setIsSearched(true);

      setFetchStatus('SUCCESS');
    } catch (err) {
      toast(err.response.data.message, { type: 'error' });
      console.log(err.response.data);

      setFetchStatus('ERROR');
    }
  }, [addVideos, fetchStatus, setNewVideosList, updateNextPageToken]);

  const handleSearchFormSubmit = useCallback(
    async ({ searchTerm }: SearchFormData) => {
      if (!searchTerm) {
        toast('É preciso preencher o campo de pesquisa.', { type: 'warning' });
        return;
      }

      updateSearchedTerm(searchTerm);

      await getVideos({ searchTerm });
    },
    [getVideos, updateSearchedTerm],
  );

  useEffect(() => {
    if (
      isLoadMoreVideosElementInView &&
      fetchStatus !== 'FETCHING' &&
      fetchStatus !== 'FETCHING_NEXT_PAGE' &&
      nextPageToken
    ) {
      getVideos({
        searchTerm: searchedTerm,
        pageToken: nextPageToken
      });
    }
  }, [isLoadMoreVideosElementInView, fetchStatus, nextPageToken, getVideos, searchedTerm]);

  useEffect(() => {
    searchForm.setValue('searchTerm', searchedTerm)
  }, [searchForm, searchedTerm]);

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
            <S.SearchForm__Form onSubmit={searchForm.handleSubmit(handleSearchFormSubmit)}>
              <ControlledSearchInput
                name="searchTerm"
                control={searchForm.control}
                placeholder="Pesquisar"
                rightButtonIcon={fetchStatus === 'FETCHING' || fetchStatus === 'FETCHING_NEXT_PAGE'
                  ? <CircularProgress color="inherit" size="1.5rem" />
                  : <Search />}
                rightButtonType="submit"
                disableRightButton={fetchStatus === 'FETCHING' || fetchStatus === 'FETCHING_NEXT_PAGE'}
              />
            </S.SearchForm__Form>
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

                {fetchStatus === 'FETCHING_NEXT_PAGE' && (
                  <Card>
                    <VideoCardSkeleton />
                  </Card>
                )}
              </S.VideoCardsGrid>

              {fetchStatus !== 'FETCHING' && fetchStatus !== 'FETCHING_NEXT_PAGE' && nextPageToken && (
                <Box ref={loadMoreVideosElementRef} sx={{ height: '2rem' }} />
              )}

              {fetchStatus === 'ERROR' && (
                <ErrorFeedback
                  title="Ocorreu um erro."
                  message={`Não foi possível buscar os vídeos${nextPageToken ? ' da próxima página' : ''}.`}
                  retryCallback={() => getVideos({ searchTerm: searchedTerm, pageToken: nextPageToken })}
                />
              )}
            </>
          )}
        </S.InnerContainer>

        <Backdrop style={{ zIndex: 1 }} open={fetchStatus === 'FETCHING'}>
          <CircularProgress color="primary" />
        </Backdrop>
      </S.Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => {
  return {
    props: {}
  };
});
