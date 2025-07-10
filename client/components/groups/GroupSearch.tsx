import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, Globe, Lock, Plus, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Group {
  id: number;
  name: string;
  description: string;
  members: number;
  avatar: string;
  isPrivate: boolean;
  category: string;
  isMember: boolean;
  isRequested?: boolean;
}

// Mock data
const mockGroups: Group[] = [
  {
    id: 4,
    name: "UI/UX Designers",
    description:
      "Share designs, get feedback, and collaborate with fellow designers.",
    members: 12340,
    avatar:
      "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=100",
    isPrivate: false,
    category: "Design",
    isMember: false,
  },
  {
    id: 5,
    name: "Tech Entrepreneurs",
    description: "Private group for tech startup founders and entrepreneurs.",
    members: 3456,
    avatar: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100",
    isPrivate: true,
    category: "Business",
    isMember: false,
  },
  {
    id: 6,
    name: "Remote Work Tips",
    description: "Tips, tools, and strategies for successful remote work.",
    members: 8765,
    avatar:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=100",
    isPrivate: false,
    category: "Lifestyle",
    isMember: false,
  },
  {
    id: 7,
    name: "AI & Machine Learning",
    description: "Discuss latest developments in AI, ML, and data science.",
    members: 15678,
    avatar:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100",
    isPrivate: false,
    category: "Technology",
    isMember: false,
  },
];

interface GroupSearchProps {
  onJoinGroup?: (groupId: number) => void;
}

export default function GroupSearch({ onJoinGroup }: GroupSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Group[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const results = mockGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(query.toLowerCase()) ||
          group.description.toLowerCase().includes(query.toLowerCase()) ||
          group.category.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleJoinGroup = (group: Group) => {
    onJoinGroup?.(group.id);
    // Update local state to show joined/requested status
    setSearchResults((results) =>
      results.map((g) =>
        g.id === group.id
          ? { ...g, isMember: !group.isPrivate, isRequested: group.isPrivate }
          : g,
      ),
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups to join..."
            className="pl-10 bg-secondary/50 border-secondary cursor-pointer"
            readOnly
          />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Find Groups</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for groups..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Popular Categories */}
          {searchQuery.trim() === "" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Popular Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Technology",
                  "Design",
                  "Business",
                  "Lifestyle",
                  "Health",
                  "Education",
                ].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery.trim() !== "" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {isSearching
                    ? "Searching..."
                    : `Results for "${searchQuery}"`}
                </h3>
                {!isSearching && (
                  <span className="text-sm text-muted-foreground">
                    {searchResults.length} groups found
                  </span>
                )}
              </div>

              {isSearching ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 bg-muted rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-muted rounded w-1/3"></div>
                              <div className="h-3 bg-muted rounded w-2/3"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {searchResults.map((group) => (
                    <Card
                      key={group.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={group.avatar} />
                            <AvatarFallback>
                              {group.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold">{group.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {group.category}
                              </Badge>
                              {group.isPrivate ? (
                                <Badge variant="secondary" className="text-xs">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Private
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Public
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {group.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {group.members.toLocaleString()} members
                              </span>

                              <Button
                                size="sm"
                                onClick={() => handleJoinGroup(group)}
                                disabled={group.isMember || group.isRequested}
                                className={cn(
                                  group.isMember && "bg-community-green",
                                  group.isRequested && "bg-community-orange",
                                )}
                              >
                                {group.isMember ? (
                                  "Joined"
                                ) : group.isRequested ? (
                                  "Requested"
                                ) : group.isPrivate ? (
                                  <>
                                    <Plus className="h-3 w-3 mr-1" />
                                    Request to Join
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3 w-3 mr-1" />
                                    Join Group
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {searchResults.length === 0 && !isSearching && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No groups found for "{searchQuery}"</p>
                      <p className="text-sm">
                        Try searching with different keywords
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Trending Groups */}
          {searchQuery.trim() === "" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Groups
              </h3>
              <div className="space-y-2">
                {mockGroups.slice(0, 3).map((group) => (
                  <Card
                    key={group.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={group.avatar} />
                          <AvatarFallback>
                            {group.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-sm">
                                {group.name}
                              </h4>
                              <span className="text-xs text-muted-foreground flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {group.members.toLocaleString()} members
                              </span>
                            </div>
                            <Button size="sm" variant="outline">
                              Join
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
