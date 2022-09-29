export interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
  };
}
