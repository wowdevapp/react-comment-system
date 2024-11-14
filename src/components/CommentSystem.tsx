import React, { useState } from 'react';
import { MessageCircle, Reply, Heart, Trash2 } from 'lucide-react';
import { Comment, CommentComponentProps, CommentSystemProps } from '../types';



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
            isLiked: false,
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
                ? {
                    ...comment,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    isLiked: !comment.isLiked
                }
                : comment
        ));
        onCommentLike?.(commentId);
    };

    const CommentComponent: React.FC<CommentComponentProps> = ({
        comment,
        level = 0
    }) => {
        const [isReplying, setIsReplying] = useState<boolean>(false);
        const [replyText, setReplyText] = useState<string>('');

        const getRandomColor = (str: string) => {
            const colors = [
                'bg-gradient-to-br from-purple-400 to-purple-600',
                'bg-gradient-to-br from-blue-400 to-blue-600',
                'bg-gradient-to-br from-green-400 to-green-600',
                'bg-gradient-to-br from-red-400 to-red-600',
                'bg-gradient-to-br from-yellow-400 to-yellow-600'
            ];
            return colors[Math.floor(str.length % colors.length)];
        };

        return (
            <div className={`${level > 0 ? 'ml-8' : ''} mb-6`}>
                <div className="flex gap-4">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full ${getRandomColor(comment.author)} shadow-lg flex items-center justify-center text-white font-medium`}>
                        {comment.author[0].toUpperCase()}
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-gray-800">{comment.author}</span>
                                <span className="text-sm text-gray-400">
                                    {new Date(comment.timestamp).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-4 leading-relaxed">{comment.text}</p>

                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => handleLike(comment.id)}
                                    className={`flex items-center gap-2 text-sm transition-colors duration-200 ${comment.isLiked
                                        ? 'text-pink-500 hover:text-pink-600'
                                        : 'text-gray-400 hover:text-pink-500'
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                                    {comment.likes > 0 && <span>{comment.likes}</span>}
                                </button>

                                <button
                                    onClick={() => setIsReplying(!isReplying)}
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200"
                                >
                                    <Reply className="w-4 h-4" />
                                    Reply
                                </button>

                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors duration-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>

                            {isReplying && (
                                <div className="mt-4 pl-4 border-l-2 border-blue-100">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-gray-400 text-sm"
                                        placeholder="Write a thoughtful reply..."
                                        rows={3}
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            onClick={() => setIsReplying(false)}
                                            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (replyText.trim()) {
                                                    addComment(replyText, comment.id);
                                                    setReplyText('');
                                                    setIsReplying(false);
                                                }
                                            }}
                                            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow"
                                        >
                                            Post Reply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {comment.replies?.length > 0 && (
                            <div className="mt-4 space-y-4">
                                {comment.replies.map(reply => (
                                    <CommentComponent key={reply.id} comment={reply} level={level + 1} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`max-w-3xl mx-auto p-6 ${className}`.trim()}>
            <div className="mb-8 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-gray-800">Discussion</h2>
                </div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-4 rounded-lg bg-gray-50 border border-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
                    placeholder="Share your thoughts..."
                    rows={3}
                />
                <div className="flex justify-end mt-3">
                    <button
                        onClick={() => {
                            if (newComment.trim()) {
                                addComment(newComment);
                                setNewComment('');
                            }
                        }}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow"
                    >
                        Post Comment
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {comments.map(comment => (
                    <CommentComponent key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
};

export default CommentSystem;