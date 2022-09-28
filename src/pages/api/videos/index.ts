import { AxiosRequestConfig } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { Video } from '../../../data/models/video';

import { youtubeApi } from '../../../services/youtube-api';

interface YoutubeSearchApiResponse {
  items: Video[];
  nextPageToken: string;
}

export default async function getVideos(request: NextApiRequest, response: NextApiResponse) {
  const { searchedTerm, pageToken } = request.query;

  const config: AxiosRequestConfig<any> = {
    params: {
      part: 'id,snippet',
      type: 'video',
      q: searchedTerm,
      maxResults: 9,
      key: process.env.YOUTUBE_API_KEY,
    },
  };

  if (pageToken) {
    config.params.pageToken = pageToken;
  }

  const youtubeApiResponse = await youtubeApi.get<YoutubeSearchApiResponse>(
    '/search',
    config,
  );

  return response.json({
    videos: youtubeApiResponse.data.items,
    nextPageToken: youtubeApiResponse.data.nextPageToken
  });
}