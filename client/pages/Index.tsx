import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Users,
  TrendingUp,
  Globe,
  Lock,
  Plus,
  MapPin,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Mock data - this will come from an API later
const featuredGroups = [
  {
    id: 1,
    name: "React Developers",
    description:
      "A community for React developers to share knowledge, ask questions, and collaborate on projects.",
    members: 15420,
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    avatar:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=100",
    isPrivate: false,
    category: "Technology",
    recentActivity: "2 hours ago",
    posts: 342,
  },
  {
    id: 2,
    name: "Digital Nomads",
    description:
      "Connect with remote workers and digital nomads around the world. Share tips, locations, and experiences.",
    members: 8934,
    coverImage:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
    avatar:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100",
    isPrivate: false,
    category: "Lifestyle",
    recentActivity: "5 hours ago",
    posts: 891,
  },
  {
    id: 3,
    name: "Startup Founders",
    description:
      "Private group for startup founders to discuss challenges, share insights, and network.",
    members: 2156,
    coverImage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
    avatar: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100",
    isPrivate: true,
    category: "Business",
    recentActivity: "1 day ago",
    posts: 156,
  },
];

const categories = [
  { name: "Technology", count: 145, color: "bg-community-blue" },
  { name: "Business", count: 89, color: "bg-community-green" },
  { name: "Lifestyle", count: 234, color: "bg-community-purple" },
  { name: "Health", count: 67, color: "bg-community-orange" },
  { name: "Arts", count: 123, color: "bg-community-pink" },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Discover Amazing Communities
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join groups that match your interests, connect with like-minded
            people, and be part of something bigger.
          </p>

          {/* Search and Create */}
          <div className="flex gap-4 max-w-lg mx-auto mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-gradient-to-r from-primary to-community-blue">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              onClick={() => setSelectedCategory("All")}
              className="rounded-full"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.name)}
                className="rounded-full"
              >
                <div
                  className={cn("w-2 h-2 rounded-full mr-2", category.color)}
                ></div>
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </section>

        {/* Trending/Featured Groups */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-community-orange" />
              Trending Groups
            </h2>
            <Button variant="ghost">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGroups.map((group) => (
              <Card
                key={group.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-32 bg-gradient-to-br from-primary/20 to-community-blue/20">
                  <img
                    src={group.coverImage}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {group.isPrivate ? (
                      <Badge variant="secondary" className="bg-background/90">
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-background/90">
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>
                        {group.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg leading-tight">
                        {group.name}
                      </h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {group.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {group.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {group.members.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {group.posts}
                      </span>
                    </div>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {group.recentActivity}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Link to={`/group/${group.id}`} className="w-full">
                    <Button className="w-full" variant="outline">
                      {group.isPrivate ? "Request to Join" : "View Group"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-gradient-to-r from-primary/5 to-community-blue/5 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">1,234</div>
              <div className="text-sm text-muted-foreground">Active Groups</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-community-green">
                45.2K
              </div>
              <div className="text-sm text-muted-foreground">Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-community-purple">
                12.1K
              </div>
              <div className="text-sm text-muted-foreground">Posts Today</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-community-orange">89</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
