import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PostCreation from "@/components/posts/PostCreation";
import PostCard from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Settings, UserPlus, Bell } from "lucide-react";

// Mock data
const groupData = {
  id: 1,
  name: "React Developers",
  description:
    "A community for React developers to share knowledge, ask questions, and collaborate on projects. We welcome developers of all skill levels!",
  members: 15420,
  coverImage:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200",
  avatar: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=100",
  isPrivate: false,
  category: "Technology",
  admins: ["John Doe", "Jane Smith"],
  joinDate: "2023-01-15",
};

const posts = [
  {
    id: 1,
    author: {
      name: "Alex Johnson",
      avatar: "/api/placeholder/40/40",
      badge: "Admin",
    },
    content:
      "🚀 Exciting news! React 18.3 has been released with some amazing performance improvements. Key highlights include:\n\n• Better Concurrent Features\n• Improved Server Components\n• Enhanced DevTools integration\n\nWhat are you most excited about? Share your thoughts below! 👇",
    timestamp: "2 hours ago",
    likes: 42,
    comments: [
      {
        id: 1,
        author: { name: "Sarah Wilson", avatar: "/api/placeholder/32/32" },
        content:
          "The concurrent features are game-changing! Can't wait to implement them.",
        timestamp: "1 hour ago",
        likes: 8,
        isLiked: false,
        replies: [
          {
            id: 2,
            author: { name: "Alex Johnson", avatar: "/api/placeholder/32/32" },
            content: "Absolutely! The performance improvements are incredible.",
            timestamp: "45 minutes ago",
            likes: 5,
            isLiked: true,
            replies: [],
          },
        ],
      },
    ],
    isLiked: false,
    isPinned: true,
    images: [],
  },
  {
    id: 2,
    author: {
      name: "Sarah Wilson",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "I'm working on a new component library and need some feedback. Should I prioritize accessibility features or performance optimizations first?",
    timestamp: "4 hours ago",
    likes: 23,
    comments: [
      {
        id: 3,
        author: { name: "Mike Chen", avatar: "/api/placeholder/32/32" },
        content:
          "Accessibility should always come first! Users with disabilities deserve equal access.",
        timestamp: "3 hours ago",
        likes: 12,
        isLiked: false,
        replies: [],
      },
    ],
    isLiked: true,
    isPinned: false,
    images: [],
    poll: {
      question: "What should I prioritize first?",
      options: [
        { text: "Accessibility features", votes: 45 },
        { text: "Performance optimizations", votes: 32 },
        { text: "Both equally", votes: 18 },
      ],
      totalVotes: 95,
      userVoted: "Accessibility features",
      expiresIn: "18 hours",
      isEnded: false,
    },
  },
  {
    id: 3,
    author: {
      name: "Mike Chen",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Just finished building a real-time chat app with React and Socket.io! The learning curve was steep but so worth it. Here are some screenshots of the final result:",
    timestamp: "1 day ago",
    likes: 67,
    comments: [
      {
        id: 4,
        author: { name: "Emma Davis", avatar: "/api/placeholder/32/32" },
        content: "This looks amazing! Would love to see the code on GitHub.",
        timestamp: "20 hours ago",
        likes: 15,
        isLiked: false,
        replies: [],
      },
    ],
    isLiked: false,
    isPinned: false,
    images: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    ],
  },
];

export default function Group() {
  const [postsData, setPostsData] = useState(posts);

  const handleLike = (postId: number) => {
    setPostsData((currentPosts) =>
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

    setPostsData((currentPosts) =>
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

    setPostsData((currentPosts) =>
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
    setPostsData((currentPosts) =>
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
    setPostsData((currentPosts) =>
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
    };

    setPostsData([newPost, ...postsData]);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Group Cover & Header */}
        <div className="relative h-64 bg-gradient-to-br from-primary/20 to-community-blue/20 mb-6">
          <img
            src={groupData.coverImage}
            alt={groupData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-end space-x-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage src={groupData.avatar} />
                <AvatarFallback>
                  {groupData.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1">{groupData.name}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {groupData.members.toLocaleString()} members
                  </span>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {groupData.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6">
          {/* Group Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Button className="bg-gradient-to-r from-primary to-community-blue">
                <UserPlus className="h-4 w-4 mr-2" />
                Joined
              </Button>
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Members</DropdownMenuItem>
                <DropdownMenuItem>Group Settings</DropdownMenuItem>
                <DropdownMenuItem>Leave Group</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Group Description */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{groupData.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2">
              {/* Create Post */}
              <PostCreation
                placeholder={`Share something with ${groupData.name}...`}
                onPost={handleNewPost}
              />

              {/* Posts Feed */}
              <div className="mt-6">
                {postsData.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onReply={handleReply}
                    onCommentLike={handleCommentLike}
                    isCurrentUser={post.author.name === "John Doe"}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Group Stats */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Group Stats</h3>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Members
                    </span>
                    <span className="font-semibold">
                      {groupData.members.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Posts Today
                    </span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Created
                    </span>
                    <span className="font-semibold">Jan 2023</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Members */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Recent Members</h3>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/api/placeholder/32/32?${i}`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">User {i}</div>
                        <div className="text-xs text-muted-foreground">
                          Joined {i} days ago
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
