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

  try {
    const youtubeApiResponse = await youtubeApi.get<YoutubeSearchApiResponse>(
      '/search',
      config,
    );

    return response.json({
      videos: youtubeApiResponse.data.items,
      nextPageToken: youtubeApiResponse.data.nextPageToken
    });
  } catch (err) {
    if (
      err.response?.data?.error?.code === 403 &&
      err.response?.data?.error?.message.includes('The request cannot be completed because you have exceeded')
    ) {
      return response.status(500).json({
        message: 'Limite de chamadas para a API do Youtube excedido.'
      });
    }

    return response.status(500).json({
      message: 'Ocorreu um erro ao tentar buscar os vídeos. Tente novamente mais tarde, por favor.'
    });
  }
}