interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  videoId: string;
}

const COMMENTS_STORAGE_KEY = 'video_comments';

export const getComments = (videoId: string): Comment[] => {
  const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
  if (!storedComments) return [];
  
  const allComments: Comment[] = JSON.parse(storedComments);
  return allComments.filter(comment => comment.videoId === videoId);
};

export const saveComment = (comment: Comment): void => {
  const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
  const allComments: Comment[] = storedComments ? JSON.parse(storedComments) : [];
  
  allComments.unshift(comment);
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(allComments));
};