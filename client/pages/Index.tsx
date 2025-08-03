import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import PostCreation from "@/components/posts/PostCreation";
import PostCard from "@/components/posts/PostCard";

// Mock data for the unified feed
const initialPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Just launched my new React component library! 🚀 It focuses on accessibility-first design and includes 30+ components. The feedback from the community has been incredible so far.\n\nKey features:\n• Full TypeScript support\n• WAI-ARIA compliant\n• Dark mode built-in\n• Customizable themes\n\nWould love to hear your thoughts! 👇",
    timestamp: "2 hours ago",
    likes: 124,
    comments: [
      {
        id: 1,
        author: { name: "Alex Johnson", avatar: "/api/placeholder/32/32" },
        content: "This looks amazing! Love the accessibility focus 👏",
        timestamp: "1 hour ago",
        likes: 8,
        isLiked: false,
        replies: [
          {
            id: 2,
            author: { name: "Sarah Chen", avatar: "/api/placeholder/32/32" },
            content:
              "Thank you! Accessibility should be the default, not an afterthought",
            timestamp: "45 minutes ago",
            likes: 12,
            isLiked: true,
            replies: [],
          },
        ],
      },
      {
        id: 3,
        author: { name: "Mike Rodriguez", avatar: "/api/placeholder/32/32" },
        content:
          "TypeScript support is exactly what I was looking for. Great timing!",
        timestamp: "30 minutes ago",
        likes: 5,
        isLiked: false,
        replies: [],
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
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Remote work survey results are in! I asked our community about their biggest challenges working from home. The results might surprise you...",
    timestamp: "4 hours ago",
    likes: 89,
    comments: [
      {
        id: 4,
        author: { name: "Emma Watson", avatar: "/api/placeholder/32/32" },
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
      userVoted: "Work-life balance",
      expiresIn: "18 hours",
      expiresAt: Date.now() + (18 * 60 * 60 * 1000), // 18 hours from now
      isEnded: false,
    },
  },
  {
    id: 3,
    author: {
      name: "Lisa Anderson",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Beautiful sunrise this morning! 🌅 Sometimes the simple moments are the most inspiring. Hope everyone has a wonderful day ahead!",
    timestamp: "6 hours ago",
    likes: 234,
    comments: [
      {
        id: 5,
        author: { name: "Tom Wilson", avatar: "/api/placeholder/32/32" },
        content: "Gorgeous! Where was this taken?",
        timestamp: "5 hours ago",
        likes: 8,
        isLiked: false,
        replies: [
          {
            id: 6,
            author: { name: "Lisa Anderson", avatar: "/api/placeholder/32/32" },
            content: "This was at the beach near my hometown. Perfect timing!",
            timestamp: "4 hours ago",
            likes: 5,
            isLiked: false,
            replies: [],
          },
        ],
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
  {
    id: 4,
    author: {
      name: "Alex Rodriguez",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Quick coding tip: Always use semantic HTML elements! They make your code more accessible and SEO-friendly. Here's why:\n\n• Screen readers can navigate better\n• Search engines understand content structure\n• CSS styling becomes more meaningful\n• Code is self-documenting\n\nWhat's your favorite HTML5 semantic element? 🤔",
    timestamp: "8 hours ago",
    likes: 67,
    comments: [
      {
        id: 7,
        author: { name: "Jamie Park", avatar: "/api/placeholder/32/32" },
        content:
          "Love using <section> and <article>! Makes everything so clear.",
        timestamp: "7 hours ago",
        likes: 12,
        isLiked: false,
        replies: [],
      },
    ],
    isLiked: true,
    isPinned: false,
  },
  {
    id: 5,
    author: {
      name: "Maya Patel",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Working on a new design system and wanted to get the community's input on color accessibility. Should we prioritize high contrast ratios even if it limits creative expression?",
    timestamp: "12 hours ago",
    likes: 45,
    comments: [
      {
        id: 8,
        author: { name: "Chris Lee", avatar: "/api/placeholder/32/32" },
        content:
          "Accessibility should always come first! Creative solutions work within constraints.",
        timestamp: "11 hours ago",
        likes: 18,
        isLiked: true,
        replies: [
          {
            id: 9,
            author: { name: "Maya Patel", avatar: "/api/placeholder/32/32" },
            content:
              "Great point! Constraints often lead to more innovative solutions.",
            timestamp: "10 hours ago",
            likes: 7,
            isLiked: false,
            replies: [],
          },
        ],
      },
    ],
    isLiked: false,
    isPinned: false,
    poll: {
      question: "What should we prioritize in design systems?",
      options: [
        { text: "Accessibility compliance", votes: 89 },
        { text: "Creative flexibility", votes: 23 },
        { text: "Both equally", votes: 67 },
        { text: "User feedback", votes: 45 },
      ],
      totalVotes: 224,
      userVoted: undefined, // This poll user hasn't voted on
      expiresIn: "6 hours",
      expiresAt: Date.now() + (6 * 60 * 60 * 1000), // 6 hours from now
      isEnded: false,
    },
  },
];

export default function Index() {
  const [posts, setPosts] = useState(initialPosts);

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
      author: { name: "John Doe", avatar: "/api/placeholder/32/32" },
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
      author: { name: "John Doe", avatar: "/api/placeholder/32/32" },
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
                // Check if it's a direct comment
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    isLiked: !comment.isLiked,
                    likes: comment.isLiked
                      ? comment.likes - 1
                      : comment.likes + 1,
                  };
                }

                // Check if it's a nested reply
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
          ? ({
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
            } as any)
          : post,
      ),
    );
  };

  const handleNewPost = (newPostData: any) => {
    const newPost = {
      id: Date.now(),
      author: {
        name: "John Doe",
        avatar: "/api/placeholder/40/40",
      },
      content: newPostData.content,
      timestamp: "Just now",
      likes: 0,
      comments: [],
      isLiked: false,
      isPinned: false,
      images: newPostData.images?.map((file: File) =>
        URL.createObjectURL(file),
      ),
      poll: newPostData.poll,
      hasOrangeBackground: newPostData.hasOrangeBackground,
    };

    setPosts([newPost, ...posts]);
  };

  return (
    <MobileLayout>
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Post Creation */}
        <PostCreation
          placeholder="Share something with the community..."
          onPost={handleNewPost}
          showActionButtons={true}
        />

        {/* Community Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onReply={handleReply}
              onCommentLike={handleCommentLike}
              onPollVote={handlePollVote}
              isCurrentUser={post.author.name === "John Doe"}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          <button
            className="text-primary font-medium"
            onClick={() => {
              // In a real app, this would load more posts from an API
              console.log("Load more posts");
            }}
          >
            Load more posts
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
