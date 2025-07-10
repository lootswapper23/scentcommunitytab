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
    comments: 8,
    isLiked: false,
    isPinned: true,
    images: [],
    poll: null,
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
    comments: 15,
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
    comments: 23,
    isLiked: false,
    isPinned: false,
    images: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    ],
    poll: null,
  },
];

export default function Group() {
  const [newPost, setNewPost] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const PostCard = ({ post }: { post: (typeof posts)[0] }) => (
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
                <Bookmark className="h-4 w-4 mr-2" />
                Save Post
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag className="h-4 w-4 mr-2" />
                Report
              </DropdownMenuItem>
              {post.author.badge === "Admin" && (
                <>
                  <Separator />
                  <DropdownMenuItem>
                    <Pin className="h-4 w-4 mr-2" />
                    {post.isPinned ? "Unpin" : "Pin"} Post
                  </DropdownMenuItem>
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
        <p className="text-sm leading-relaxed whitespace-pre-line mb-4">
          {post.content}
        </p>

        {/* Images */}
        {post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4 rounded-lg overflow-hidden">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                className="w-full h-48 object-cover"
              />
            ))}
          </div>
        )}

        {/* Poll */}
        {post.poll && (
          <div className="border rounded-lg p-4 mb-4 bg-secondary/50">
            <h4 className="font-semibold mb-3">{post.poll.question}</h4>
            <div className="space-y-2 mb-3">
              {post.poll.options.map((option, index) => {
                const percentage = (option.votes / post.poll!.totalVotes) * 100;
                const isVoted = post.poll!.userVoted === option.text;

                return (
                  <div
                    key={index}
                    className={cn(
                      "relative rounded-md p-3 border cursor-pointer transition-colors",
                      isVoted
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-secondary/50",
                    )}
                  >
                    <div
                      className="absolute inset-0 bg-primary/10 rounded-md transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="relative flex justify-between items-center">
                      <span className="text-sm font-medium">{option.text}</span>
                      <span className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              {post.poll.totalVotes} votes • Expires in {post.poll.expiresIn}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                post.isLiked && "text-red-500 hover:text-red-600",
              )}
            >
              <Heart
                className={cn("h-4 w-4 mr-2", post.isLiked && "fill-current")}
              />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );

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
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Dialog
                      open={isCreatePostOpen}
                      onOpenChange={setIsCreatePostOpen}
                    >
                      <DialogTrigger asChild>
                        <Input
                          placeholder="What's on your mind?"
                          className="cursor-pointer"
                          readOnly
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Create Post</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="What's on your mind?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-32"
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Photo
                              </Button>
                              <Button variant="ghost" size="sm">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Poll
                              </Button>
                            </div>
                            <Button>
                              <Send className="h-4 w-4 mr-2" />
                              Post
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
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
