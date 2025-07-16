import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

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
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onReply?: (postId: number, commentId: number, content: string) => void;
  onCommentLike?: (postId: number, commentId: number) => void;
  postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onReply,
  onCommentLike,
  postId,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleReply = (commentId: number) => {
    if (replyContent.trim()) {
      onReply?.(postId, commentId, replyContent);
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const handleCommentLike = (commentId: number) => {
    onCommentLike?.(postId, commentId);
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <View
      key={comment.id}
      style={[styles.commentContainer, isReply && styles.replyContainer]}
    >
      <Image source={{ uri: comment.author.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <View style={styles.commentHeader}>
            <Text style={styles.authorName}>{comment.author.name}</Text>
            <Text style={styles.timestamp}>{comment.timestamp}</Text>
          </View>
          <Text style={styles.commentText}>{comment.content}</Text>
        </View>

        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCommentLike(comment.id)}
            activeOpacity={0.7}
          >
            <Icon
              name="heart"
              size={14}
              color={comment.isLiked ? colors.like : colors.textSecondary}
              fill={comment.isLiked ? colors.like : "none"}
            />
            <Text
              style={[
                styles.actionText,
                comment.isLiked && { color: colors.like },
              ]}
            >
              {comment.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              setReplyingTo(replyingTo === comment.id ? null : comment.id)
            }
            activeOpacity={0.7}
          >
            <Icon
              name="corner-up-left"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>

        {/* Reply Input */}
        {replyingTo === comment.id && (
          <View style={styles.replyInputContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/32?img=1" }}
              style={styles.smallAvatar}
            />
            <TextInput
              style={styles.replyInput}
              placeholder="Write a reply..."
              value={replyContent}
              onChangeText={setReplyContent}
              multiline
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleReply(comment.id)}
              disabled={!replyContent.trim()}
            >
              <Icon
                name="send"
                size={16}
                color={
                  replyContent.trim() ? colors.primary : colors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map((reply) => renderComment(reply, true))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Add Comment Input */}
      <View style={styles.inputContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/32?img=1" }}
          style={styles.avatar}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          placeholderTextColor={colors.textSecondary}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Icon
            name="send"
            size={18}
            color={newComment.trim() ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      {comments.length > 0 && (
        <View style={styles.commentsContainer}>
          {comments.map((comment) => renderComment(comment))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: typography.base,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
  },
  commentsContainer: {
    paddingTop: 8,
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  replyContainer: {
    marginLeft: 32,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 12,
    marginBottom: 4,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  authorName: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginRight: 8,
  },
  timestamp: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  commentText: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    lineHeight: typography.sm * 1.4,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    padding: 4,
  },
  actionText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: typography.medium,
  },
  replyInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
    paddingHorizontal: 12,
  },
  replyInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: typography.sm,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 80,
  },
  repliesContainer: {
    marginTop: 8,
  },
});

export default CommentSection;
