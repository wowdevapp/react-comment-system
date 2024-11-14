export interface Comment {
  id: number;
  text: string;
  author: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies: Comment[];
  parentId?: number | null;
}

export interface CommentSystemProps {
  initialComments?: Comment[];
  onCommentAdd?: (comment: Comment) => void;
  onCommentDelete?: (commentId: number) => void;
  onCommentLike?: (commentId: number) => void;
  className?: string;
}

export interface CommentComponentProps {
  comment: Comment;
  level?: number;
}
