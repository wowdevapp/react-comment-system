import React, { useState } from 'react';
import { User, MessageSquare, ThumbsUp, Reply, Trash2 } from 'lucide-react';
import { Comment, CommentSystemProps } from '../types';

interface CommentComponentProps {
    comment: Comment;
    level?: number;
}

export const CommentSystem: React.FC<CommentSystemProps> = ({
    initialComments = [],
    onCommentAdd,
    onCommentDelete,
    onCommentLike,
    className = '',
}) => {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState<string>('');

    const addComment = (text: string, parentId: number | null = null) => {
        const newCommentObj: Comment = {
            id: Date.now(),
            text,
            author: 'Current User',
            timestamp: new Date().toISOString(),
            parentId,
            likes: 0,
            replies: []
        };

        if (parentId === null) {
            const updatedComments = [...comments, newCommentObj];
            setComments(updatedComments);
            onCommentAdd?.(newCommentObj);
        } else {
            const updatedComments = comments.map(comment => {
                if (comment.id === parentId) {
                    return {
                        ...comment,
                        replies: [...comment.replies, newCommentObj]
                    };
                }
                return comment;
            });
            setComments(updatedComments);
            onCommentAdd?.(newCommentObj);
        }
    };

    const handleDelete = (commentId: number) => {
        setComments(comments.filter(comment => comment.id !== commentId));
        onCommentDelete?.(commentId);
    };

    const handleLike = (commentId: number) => {
        setComments(comments.map(comment =>
            comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment
        ));
        onCommentLike?.(commentId);
    };

    // Make CommentComponent a proper component with TypeScript props
    const CommentComponent: React.FC<CommentComponentProps> = ({ comment, level = 0 }) => {
        const [isReplying, setIsReplying] = useState<boolean>(false);
        const [replyText, setReplyText] = useState<string>('');

        // Calculate margin class based on level
        const marginClass = `ml-${level * 4}`;

        return (
            <div className={`${marginClass} mb-4`}>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                        <User className="w-6 h-6 text-gray-500 mr-2" />
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-gray-500 text-sm ml-2">
                            {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-gray-700 mb-3">{comment.text}</p>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => handleLike(comment.id)}
                            className="flex items-center text-gray-500 hover:text-blue-500"
                        >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {comment.likes}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center text-gray-500 hover:text-blue-500"
                        >
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDelete(comment.id)}
                            className="flex items-center text-gray-500 hover:text-red-500"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                        </button>
                    </div>

                    {isReplying && (
                        <div className="mt-4">
                            <textarea
                                value={replyText}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                                className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Write a reply..."
                                rows={2}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReplying(false)}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (replyText.trim()) {
                                            addComment(replyText, comment.id);
                                            setReplyText('');
                                            setIsReplying(false);
                                        }
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    )}

                    {comment.replies?.length > 0 && (
                        <div className="mt-4">
                            {comment.replies.map(reply => (
                                <CommentComponent key={reply.id} comment={reply} level={level + 1} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`max-w-2xl mx-auto p-4 ${className}`.trim()}>
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <MessageSquare className="w-6 h-6 text-gray-500 mr-2" />
                    <h2 className="text-xl font-semibold">Comments</h2>
                </div>
                <textarea
                    value={newComment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                    className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write a comment..."
                    rows={3}
                />
                <div className="flex justify-end mt-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (newComment.trim()) {
                                addComment(newComment);
                                setNewComment('');
                            }
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Comment
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {comments.map(comment => (
                    <CommentComponent key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
};