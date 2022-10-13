import { NextApiRequest, NextApiResponse } from 'next';

import { Video } from '../../../data/models/video';

import { youtubeApi } from '../../../services/youtube-api';

interface YoutubeApiResponse {
  items: Video[];
}

export default async function getVideoDetails(request: NextApiRequest, response: NextApiResponse) {
  const { videoId } = request.query;
  
  try {
    const youtubeApiResponse = await youtubeApi.get<YoutubeApiResponse>('/videos', {
      params: {
        id: videoId,
        part: 'snippet,statistics',
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const video = youtubeApiResponse.data.items[0];

    if (video) {
      return response.json(video);
    } else {
      return response.status(500).json({
        message: 'Ocorreu um erro ao tentar buscar as informações desse vídeo. Tente novamente mais tarde, por favor.'
      });
    }
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
      message: 'Ocorreu um erro ao tentar buscar as informações desse vídeo. Tente novamente mais tarde, por favor.'
    });
  }
}