import { NextApiRequest, NextApiResponse } from 'next';

import { Video } from '../../../data/models/video';

import { youtubeApi } from '../../../services/youtube-api';

interface YoutubeApiResponse {
  items: Video[];
}

export default async function getVideoDetails(request: NextApiRequest, response: NextApiResponse) {
  const { videoId } = request.query;
  
  const youtubeApiResponse = await youtubeApi.get<YoutubeApiResponse>('/videos', {
    params: {
      id: videoId,
      part: 'snippet,statistics',
      key: process.env.YOUTUBE_API_KEY,
    },
  });

  return response.json(youtubeApiResponse.data.items[0]);
}