import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PostCreation from "@/components/posts/PostCreation";
import PostCard from "@/components/posts/PostCard";
import GroupSearch from "@/components/groups/GroupSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  Users,
  MessageCircle,
  Calendar,
  Plus,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for the feed
const featuredPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Just launched my new React component library! 🚀 It focuses on accessibility-first design and includes 30+ components. The feedback from the community has been incredible so far. Thank you all for the support!\n\nKey features:\n• Full TypeScript support\n• WAI-ARIA compliant\n• Dark mode built-in\n• Customizable themes\n\nWould love to hear your thoughts! Link in the comments 👇",
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
    groupName: "React Developers",
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
    groupName: "Digital Nomads",
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
    },
  },
  {
    id: 3,
    author: {
      name: "Lisa Anderson",
      avatar: "/api/placeholder/40/40",
      badge: "Admin",
    },
    content:
      "Welcome to all our new members! 👋 We've grown to over 15,000 developers this month. To help everyone get started, I've pinned some essential resources in our group guide.\n\nDon't forget to:\n✅ Introduce yourself\n✅ Read our community guidelines  \n✅ Join our weekly coding challenges\n\nLet's build amazing things together! 💻",
    timestamp: "1 day ago",
    likes: 234,
    comments: [
      {
        id: 5,
        author: { name: "New Member", avatar: "/api/placeholder/32/32" },
        content: "Thank you for the warm welcome! Excited to be here",
        timestamp: "20 hours ago",
        likes: 8,
        isLiked: false,
        replies: [],
      },
    ],
    isLiked: false,
    isPinned: true,
    groupName: "React Developers",
  },
];

const trendingGroups = [
  {
    id: 1,
    name: "React Developers",
    members: 15420,
    newPosts: 23,
    avatar: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=50",
    color: "bg-community-blue",
  },
  {
    id: 2,
    name: "Digital Nomads",
    members: 8934,
    newPosts: 12,
    avatar: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=50",
    color: "bg-community-green",
  },
  {
    id: 3,
    name: "UI/UX Designers",
    members: 12340,
    newPosts: 18,
    avatar: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=50",
    color: "bg-community-purple",
  },
];

export default function Index() {
  const [posts, setPosts] = useState(featuredPosts);

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
      groupName: newPostData.groupName,
      images: newPostData.images?.map((file: File) =>
        URL.createObjectURL(file),
      ),
      poll: newPostData.poll,
    };

    setPosts([newPost, ...posts]);
  };

  const handleJoinGroup = (groupId: number) => {
    console.log(`Joining group ${groupId}`);
    // In a real app, this would call an API
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <GroupSearch onJoinGroup={handleJoinGroup} />
          <Button className="bg-gradient-to-r from-primary to-community-blue">
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        {/* Post Creation */}
        <PostCreation
          placeholder="Share something with your communities..."
          onPost={handleNewPost}
        />

        {/* Quick Actions */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          <Badge
            variant="secondary"
            className="whitespace-nowrap bg-gradient-to-r from-primary/10 to-community-blue/10 text-primary border-primary/20"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            <Users className="h-3 w-3 mr-1" />
            My Groups
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            <MessageCircle className="h-3 w-3 mr-1" />
            Recent Activity
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            <Globe className="h-3 w-3 mr-1" />
            Discover
          </Badge>
        </div>

        {/* Featured Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onReply={handleReply}
              isCurrentUser={post.author.name === "John Doe"}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" className="w-full">
            Load More Posts
          </Button>
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile, shown as overlay or separate screen */}
      <div className="hidden xl:block fixed right-6 top-20 w-80 space-y-6">
        {/* Trending Groups */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-community-orange" />
              Trending Groups
            </h3>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {trendingGroups.map((group) => (
              <Link
                key={group.id}
                to={`/group/${group.id}`}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={group.avatar} />
                  <AvatarFallback>
                    {group.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{group.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {group.members.toLocaleString()} members
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-community-orange">
                    {group.newPosts} new
                  </div>
                  <div className="text-xs text-muted-foreground">posts</div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-xs text-muted-foreground">
                  Groups Joined
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-community-green">
                  148
                </div>
                <div className="text-xs text-muted-foreground">
                  Posts This Week
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Recent Activity
            </h3>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {[
              { text: "Sarah liked your post", time: "2h ago" },
              { text: "New member joined React Developers", time: "4h ago" },
              { text: "You commented on David's poll", time: "1d ago" },
            ].map((activity, index) => (
              <div key={index} className="text-sm">
                <div className="text-foreground">{activity.text}</div>
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
