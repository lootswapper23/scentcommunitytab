import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Pin,
  Send,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Flag,
  Reply,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SocialShare from "./SocialShare";

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  isEditing?: boolean;
}

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isPinned?: boolean;
  images?: string[];
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    userVoted?: string;
    expiresIn: string;
    expiresAt?: number; // timestamp
    isEnded?: boolean;
  } | null;
  hasOrangeBackground?: boolean;
  groupName?: string;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: number) => void;
  onComment?: (postId: number, content: string) => void;
  onReply?: (postId: number, commentId: number, content: string) => void;
  onCommentLike?: (postId: number, commentId: number) => void;
  onPollVote?: (postId: number, optionIndex: number) => void;
  isCurrentUser?: boolean;
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onReply,
  onCommentLike,
  onPollVote,
  isCurrentUser = false,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleLike = () => {
    onLike?.(post.id);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      onComment?.(post.id, newComment);
      setNewComment("");
    }
  };

  const handleReply = (commentId: number) => {
    if (replyContent.trim()) {
      onReply?.(post.id, commentId, replyContent);
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const saveEdit = () => {
    // In a real app, this would call an API
    setEditingComment(null);
    setEditContent("");
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  const handleCommentLike = (commentId: number) => {
    onCommentLike?.(post.id, commentId);
  };

  const votePoll = (optionIndex: number) => {
    onPollVote?.(post.id, optionIndex);
  };

  const CommentComponent = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <div
      className={cn(
        "space-y-2",
        isReply && "ml-8 pl-4 border-l-2 border-muted",
      )}
    >
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {comment.author.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="bg-secondary rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-sm">
                {comment.author.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {comment.timestamp}
              </span>
            </div>
            {editingComment === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-16 resize-none"
                />
                <div className="flex items-center space-x-2">
                  <Button size="sm" onClick={saveEdit}>
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{comment.content}</p>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-1 text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCommentLike(comment.id)}
              className={cn(
                "h-auto p-0 text-xs text-muted-foreground hover:text-foreground transition-colors",
                comment.isLiked && "text-red-500 hover:text-red-600",
              )}
            >
              <Heart
                className={cn(
                  "h-3 w-3 mr-1",
                  comment.isLiked && "fill-current",
                )}
              />
              {comment.likes}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>

            {isCurrentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => startEdit(comment)}>
                    <Edit3 className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-2 flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/api/placeholder/24/24" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Input
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="flex-1 h-8"
                onKeyPress={(e) => e.key === "Enter" && handleReply(comment.id)}
              />
              <Button
                size="sm"
                onClick={() => handleReply(comment.id)}
                disabled={!replyContent.trim()}
                className="h-8"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {comment.replies.map((reply) => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{post.author.name}</span>
                {post.author.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {post.author.badge}
                  </Badge>
                )}
                {post.groupName && (
                  <span className="text-sm text-muted-foreground">
                    in {post.groupName}
                  </span>
                )}
                {post.isPinned && (
                  <Pin className="h-4 w-4 text-community-orange" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {post.timestamp}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Flag className="h-4 w-4 mr-2" />
                Report
              </DropdownMenuItem>
              {isCurrentUser && (
                <>
                  <Separator />
                  <DropdownMenuItem>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          className={cn(
            "mb-4",
            post.hasOrangeBackground
              ? "bg-community-orange rounded-lg p-8 text-center min-h-48 flex items-center justify-center"
              : ""
          )}
        >
          <p
            className={cn(
              "leading-relaxed whitespace-pre-line",
              post.hasOrangeBackground
                ? "text-white text-3xl font-bold"
                : "text-sm"
            )}
          >
            {post.content}
          </p>
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div
            className={cn(
              "mb-4 rounded-lg overflow-hidden",
              post.images.length === 1 && "max-w-full",
              post.images.length === 2 && "grid grid-cols-2 gap-1",
              post.images.length >= 3 && "grid grid-cols-2 gap-1",
            )}
          >
            {post.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={cn(
                  "relative",
                  post.images.length === 1 && "aspect-square max-h-80",
                  post.images.length === 2 && "aspect-square",
                  post.images.length >= 3 &&
                    index === 0 &&
                    "col-span-2 aspect-video",
                  post.images.length >= 3 && index > 0 && "aspect-square",
                )}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
                {/* Show count overlay for 4+ images */}
                {post.images.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      +{post.images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Poll */}
        {post.poll && (
          <div className="border rounded-xl p-4 mb-4 bg-gradient-to-br from-secondary/30 to-secondary/60">
            <h4 className="font-semibold mb-4 text-base">
              {post.poll.question}
            </h4>
            <div className="space-y-3 mb-4">
              {post.poll.options.map((option, index) => {
                const percentage = (option.votes / post.poll!.totalVotes) * 100;
                const isVoted = post.poll!.userVoted === option.text;
                const hasVoted = !!post.poll!.userVoted;
                const isPollEnded = post.poll!.isEnded;
                const showResults = hasVoted || isPollEnded;

                return (
                  <button
                    key={index}
                    onClick={() => votePoll(index)}
                    disabled={hasVoted || isPollEnded}
                    className={cn(
                      "relative w-full rounded-xl p-4 border-2 cursor-pointer transition-all text-left active:scale-[0.98]",
                      isVoted
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border bg-background hover:bg-secondary/30 hover:border-primary/50",
                      (hasVoted || isPollEnded) && !isVoted && "opacity-70",
                      (hasVoted || isPollEnded) && "cursor-default",
                    )}
                  >
                    {/* Progress bar - only show if results should be visible */}
                    {showResults && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-community-blue/20 rounded-xl transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    )}
                    <div className="relative flex justify-between items-center">
                      <span className="font-medium">{option.text}</span>
                      {showResults ? (
                        <span className="text-sm font-bold">
                          {percentage.toFixed(0)}%
                        </span>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-sm text-muted-foreground flex items-center justify-between">
              {post.poll.userVoted || post.poll.isEnded ? (
                <span>{post.poll.totalVotes} total votes</span>
              ) : (
                <span>Vote to see results</span>
              )}
              <span>
                {post.poll.isEnded
                  ? "Poll ended"
                  : `Expires in ${post.poll.expiresIn}`}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex-col space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95",
                post.isLiked && "text-red-500 hover:text-red-600",
              )}
            >
              <Heart
                className={cn(
                  "h-4 w-4 mr-2 transition-all duration-200",
                  post.isLiked && "fill-current scale-110",
                )}
              />
              {post.likes}
            </Button>

            <Collapsible open={showComments} onOpenChange={setShowComments}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {post.comments.length}
                  {showComments ? (
                    <ChevronUp className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>

            <SocialShare
              postId={post.id}
              postContent={post.content}
              author={post.author.name}
            />
          </div>
        </div>

        {/* Comments Section */}
        <Collapsible open={showComments} onOpenChange={setShowComments}>
          <CollapsibleContent className="w-full space-y-4">
            {/* Add Comment */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleComment()}
              />
              <Button
                size="sm"
                onClick={handleComment}
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <CommentComponent key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
}
