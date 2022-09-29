import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { Video } from '../data/models/video';

type VideoWithKey = Video & { key?: string };

interface VideosListContextData {
  videosList: VideoWithKey[];
  searchedTerm: string;
  nextPageToken: string;
  setNewVideosList(videos: Video[]): void;
  addVideos(videos: Video[]): void;
  updateSearchedTerm(term: string): void;
  updateNextPageToken(token: string): void;
}

const VideosListContext = createContext<VideosListContextData>(
  {} as VideosListContextData,
);

function VideosListProvider ({ children }) {
  const [videosList, setVideosList] = useState<VideoWithKey[]>([]);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [nextPageToken, setNextPageToken] = useState('');

  const loadStoredVideos = () => {
    const storedVideos = sessionStorage.getItem('@Teste_iCasei/videos-list');

    if (storedVideos) {
      setVideosList(JSON.parse(storedVideos));
    }

    setVideosList([]);
  };

  const loadStoredSearchedTerm = () => {
    const storedSearchedTerm = sessionStorage.getItem(
      '@Teste_iCasei/searched-term',
    );

    setSearchedTerm(storedSearchedTerm || '');
  };

  const loadStoredNextPageToken = () => {
    const storedNextPageTokenn = sessionStorage.getItem(
      '@Teste_iCasei/next-page-token',
    );

    setNextPageToken(storedNextPageTokenn || '');
  };

  const setNewVideosList = useCallback((videos: Video[]) => {
    setVideosList(videos);

    sessionStorage.setItem('@Teste_iCasei/videos-list', JSON.stringify(videos));
  }, []);

  const addVideos = useCallback((videos: Video[]) => {
    setVideosList(prevState => [...prevState, ...videos]);

    const storagedVideos = sessionStorage.getItem('@Teste_iCasei/videos-list');

    if (!storagedVideos) {
      sessionStorage.setItem(
        '@Teste_iCasei/videos-list',
        JSON.stringify(videos),
      );

      return;
    }

    const parsedStoragedVideos = JSON.parse(storagedVideos);

    sessionStorage.setItem(
      '@Teste_iCasei/videos-list',
      JSON.stringify([...parsedStoragedVideos, ...videos]),
    );
  }, []);

  const updateSearchedTerm = useCallback((term: string) => {
    setSearchedTerm(term);

    sessionStorage.setItem('@Teste_iCasei/searched-term', term);
  }, []);

  const updateNextPageToken = useCallback((token: string) => {
    setNextPageToken(token);

    sessionStorage.setItem('@Teste_iCasei/next-page-token', token);
  }, []);

  useEffect(() => {
    loadStoredVideos();
    loadStoredSearchedTerm();
    loadStoredNextPageToken();
  }, []);

  return (
    <VideosListContext.Provider
      value={{
        videosList,
        searchedTerm,
        nextPageToken,
        setNewVideosList,
        addVideos,
        updateSearchedTerm,
        updateNextPageToken,
      }}
    >
      {children}
    </VideosListContext.Provider>
  );
};

function useVideosList(): VideosListContextData {
  const context = useContext(VideosListContext);

  if (!context) {
    throw new Error('useVideosList must be used within a VideosListProvider');
  }

  return context;
}

export { VideosListProvider, useVideosList };
