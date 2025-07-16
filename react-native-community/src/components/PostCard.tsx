import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import Toast from "react-native-toast-message";

import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import CommentSection from "./CommentSection";
import SocialShareModal from "./SocialShareModal";
import PollComponent from "./PollComponent";

const { width: screenWidth } = Dimensions.get("window");

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
    isEnded?: boolean;
  };
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

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onReply,
  onCommentLike,
  onPollVote,
  isCurrentUser = false,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleLike = () => {
    onLike?.(post.id);

    // Haptic feedback for iOS
    if (Platform.OS === "ios") {
      const { HapticFeedback } = require("react-native");
      HapticFeedback.impact(HapticFeedback.ImpactFeedbackStyle.Light);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    const imageWidth =
      post.images.length === 1 ? screenWidth - 32 : (screenWidth - 40) / 2;
    const imageHeight = post.images.length === 1 ? 300 : 200;

    return (
      <View style={styles.imagesContainer}>
        {post.images.slice(0, 4).map((image, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.imageContainer,
              {
                width: imageWidth,
                height: imageHeight,
              },
            ]}
            onPress={() => {
              // Handle image view/zoom
              console.log("Open image viewer", image);
            }}
          >
            <Image source={{ uri: image }} style={styles.image} />
            {post.images!.length > 4 && index === 3 && (
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>
                  +{post.images!.length - 4}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
          <View style={styles.authorDetails}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              {post.author.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{post.author.badge}</Text>
                </View>
              )}
              {post.isPinned && (
                <Icon
                  name="bookmark"
                  size={16}
                  color={colors.communityOrange}
                />
              )}
            </View>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>{post.content}</Text>
      </View>

      {/* Images */}
      {renderImages()}

      {/* Poll */}
      {post.poll && (
        <PollComponent
          poll={post.poll}
          onVote={(optionIndex) => onPollVote?.(post.id, optionIndex)}
        />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Icon
            name="heart"
            size={20}
            color={post.isLiked ? colors.like : colors.textSecondary}
            fill={post.isLiked ? colors.like : "none"}
          />
          <Text
            style={[styles.actionText, post.isLiked && { color: colors.like }]}
          >
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
          activeOpacity={0.7}
        >
          <Icon name="message-circle" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{post.comments.length}</Text>
          <Icon
            name={showComments ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Icon name="share" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          comments={post.comments}
          onAddComment={(content) => onComment?.(post.id, content)}
          onReply={onReply}
          onCommentLike={onCommentLike}
          postId={post.id}
        />
      )}

      {/* Share Modal */}
      <SocialShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={post}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  authorName: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginRight: 8,
  },
  badge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  timestamp: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    marginBottom: 12,
  },
  contentText: {
    fontSize: typography.base,
    lineHeight: typography.base * typography.relaxed,
    color: colors.textPrimary,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  imageOverlayText: {
    color: "white",
    fontSize: typography.lg,
    fontWeight: typography.semibold,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: typography.medium,
  },
});

export default PostCard;
