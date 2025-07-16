import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import PostCard from "../components/PostCard";
import PostCreation from "../components/PostCreation";

// Mock data
const initialPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
    content:
      "Just launched my new React component library! 🚀 It focuses on accessibility-first design and includes 30+ components. The feedback from the community has been incredible so far.\n\nKey features:\n• Full TypeScript support\n• WAI-ARIA compliant\n• Dark mode built-in\n• Customizable themes\n\nWould love to hear your thoughts! 👇",
    timestamp: "2 hours ago",
    likes: 124,
    comments: [
      {
        id: 1,
        author: {
          name: "Alex Johnson",
          avatar: "https://i.pravatar.cc/32?img=3",
        },
        content: "This looks amazing! Love the accessibility focus 👏",
        timestamp: "1 hour ago",
        likes: 8,
        isLiked: false,
        replies: [
          {
            id: 2,
            author: {
              name: "Sarah Chen",
              avatar: "https://i.pravatar.cc/32?img=5",
            },
            content:
              "Thank you! Accessibility should be the default, not an afterthought",
            timestamp: "45 minutes ago",
            likes: 12,
            isLiked: true,
            replies: [],
          },
        ],
      },
    ],
    isLiked: true,
    isPinned: false,
    images: [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
    ],
  },
  {
    id: 2,
    author: {
      name: "David Kim",
      avatar: "https://i.pravatar.cc/40?img=8",
    },
    content:
      "Remote work survey results are in! I asked our community about their biggest challenges working from home. The results might surprise you...",
    timestamp: "4 hours ago",
    likes: 89,
    comments: [
      {
        id: 4,
        author: {
          name: "Emma Watson",
          avatar: "https://i.pravatar.cc/32?img=9",
        },
        content:
          "Isolation was definitely my #1 challenge when I started remote work",
        timestamp: "3 hours ago",
        likes: 15,
        isLiked: false,
        replies: [],
      },
    ],
    isLiked: false,
    isPinned: false,
    poll: {
      question: "What's your biggest remote work challenge?",
      options: [
        { text: "Staying motivated", votes: 156 },
        { text: "Communication with team", votes: 134 },
        { text: "Work-life balance", votes: 289 },
        { text: "Feeling isolated", votes: 201 },
      ],
      totalVotes: 780,
      userVoted: undefined,
      expiresIn: "18 hours",
      isEnded: false,
    },
  },
  {
    id: 3,
    author: {
      name: "Lisa Anderson",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
    content:
      "Beautiful sunrise this morning! 🌅 Sometimes the simple moments are the most inspiring. Hope everyone has a wonderful day ahead!",
    timestamp: "6 hours ago",
    likes: 234,
    comments: [
      {
        id: 5,
        author: {
          name: "Tom Wilson",
          avatar: "https://i.pravatar.cc/32?img=15",
        },
        content: "Gorgeous! Where was this taken?",
        timestamp: "5 hours ago",
        likes: 8,
        isLiked: false,
        replies: [],
      },
    ],
    isLiked: false,
    isPinned: false,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400",
      "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=400",
    ],
  },
];

const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [refreshing, setRefreshing] = useState(false);

  const handleLike = (postId: number) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const handleComment = (postId: number, content: string) => {
    const newComment = {
      id: Date.now(),
      author: { name: "John Doe", avatar: "https://i.pravatar.cc/32?img=1" },
      content,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post,
      ),
    );
  };

  const handleReply = (postId: number, commentId: number, content: string) => {
    const newReply = {
      id: Date.now(),
      author: { name: "John Doe", avatar: "https://i.pravatar.cc/32?img=1" },
      content,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, replies: [...comment.replies, newReply] }
                  : comment,
              ),
            }
          : post,
      ),
    );
  };

  const handleCommentLike = (postId: number, commentId: number) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    isLiked: !comment.isLiked,
                    likes: comment.isLiked
                      ? comment.likes - 1
                      : comment.likes + 1,
                  };
                }

                if (comment.replies.some((reply) => reply.id === commentId)) {
                  return {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                      reply.id === commentId
                        ? {
                            ...reply,
                            isLiked: !reply.isLiked,
                            likes: reply.isLiked
                              ? reply.likes - 1
                              : reply.likes + 1,
                          }
                        : reply,
                    ),
                  };
                }

                return comment;
              }),
            }
          : post,
      ),
    );
  };

  const handlePollVote = (postId: number, optionIndex: number) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId && post.poll
          ? {
              ...post,
              poll: {
                ...post.poll,
                options: post.poll.options.map((option, index) =>
                  index === optionIndex
                    ? { ...option, votes: option.votes + 1 }
                    : option,
                ),
                totalVotes: post.poll.totalVotes + 1,
                userVoted: post.poll.options[optionIndex].text,
              },
            }
          : post,
      ),
    );
  };

  const handleNewPost = (newPostData: any) => {
    const newPost = {
      id: Date.now(),
      author: {
        name: "John Doe",
        avatar: "https://i.pravatar.cc/40?img=1",
      },
      content: newPostData.content,
      timestamp: "Just now",
      likes: 0,
      comments: [],
      isLiked: false,
      isPinned: false,
      images: newPostData.images?.map((image: any) => image.uri),
      poll: newPostData.poll,
    };

    setPosts([newPost, ...posts]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logo}>
          <Icon name="users" size={20} color="white" />
        </View>
        <Text style={styles.appTitle}>Community</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="bell" size={20} color={colors.textSecondary} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Image
            source={{ uri: "https://i.pravatar.cc/32?img=1" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPost = ({ item }: { item: any }) => (
    <PostCard
      post={item}
      onLike={handleLike}
      onComment={handleComment}
      onReply={handleReply}
      onCommentLike={handleCommentLike}
      onPollVote={handlePollVote}
      isCurrentUser={item.author.name === "John Doe"}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {renderHeader()}

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <PostCreation
            onPost={handleNewPost}
            placeholder="Share something with the community..."
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  appTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.communityOrange,
    borderWidth: 2,
    borderColor: colors.card,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  feedContainer: {
    paddingBottom: 20,
  },
});

export default HomeScreen;
