import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, BarChart3, X, Plus, Send, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCreationProps {
  placeholder?: string;
  onPost?: (post: any) => void;
  showActionButtons?: boolean;
}

export default function PostCreation({
  placeholder = "What's on your mind?",
  onPost,
  showActionButtons = false,
}: PostCreationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [hasOrangeBackground, setHasOrangeBackground] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedImages.length + files.length <= 4) {
      setSelectedImages([...selectedImages, ...files]);
      // Reset orange background when images are added
      setHasOrangeBackground(false);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handlePost = () => {
    const post = {
      content: postContent,
      images: selectedImages,
      poll: showPoll
        ? {
            question: pollQuestion,
            options: pollOptions.filter((opt) => opt.trim() !== ""),
            expiresIn: "24 hours",
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
          }
        : null,
      hasOrangeBackground,
      timestamp: new Date(),
    };

    onPost?.(post);

    // Reset form
    setPostContent("");
    setSelectedImages([]);
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setHasOrangeBackground(false);
    setIsOpen(false);
  };

  const canPost =
    postContent.trim() ||
    selectedImages.length > 0 ||
    (showPoll &&
      pollQuestion.trim() &&
      pollOptions.filter((opt) => opt.trim()).length >= 2);

  const openWithImage = () => {
    setIsOpen(true);
    // Small delay to ensure modal is open before triggering file picker
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const openWithPoll = () => {
    setIsOpen(true);
    setShowPoll(true);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/api/placeholder/40/40" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Input
                data-post-creation-trigger
                placeholder={placeholder}
                className="cursor-pointer bg-secondary/50"
                readOnly
              />
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto mx-4">
              <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Post Content */}
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder={placeholder}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className={cn(
                        "resize-none border-none shadow-none text-lg focus-visible:ring-0",
                        hasOrangeBackground
                          ? "bg-community-orange text-white text-center text-3xl font-bold placeholder:text-white/70 rounded-lg p-8 min-h-48"
                          : "min-h-24 placeholder:text-muted-foreground",
                      )}
                    />
                  </div>
                </div>

                {/* Selected Images */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Poll Creation */}
                {showPoll && (
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Create Poll</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Expires in 24 hours</span>
                      </div>
                    </div>

                    <Input
                      placeholder="Ask a question..."
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="font-medium"
                    />

                    <div className="space-y-2">
                      {pollOptions.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) =>
                              updatePollOption(index, e.target.value)
                            }
                          />
                          {pollOptions.length > 2 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePollOption(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      {pollOptions.length < 4 && (
                        <Button
                          variant="ghost"
                          onClick={addPollOption}
                          className="w-full border-2 border-dashed"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Option
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Color Background Section - Only show if no images */}
                {selectedImages.length === 0 && (
                  <div className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-semibold">Add Color Background</h4>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          setHasOrangeBackground(!hasOrangeBackground)
                        }
                        className={cn(
                          "w-12 h-12 rounded-lg bg-community-orange transition-all duration-200 hover:scale-105",
                          hasOrangeBackground
                            ? "border-4 border-black shadow-lg"
                            : "border-2 border-transparent",
                        )}
                      />
                      <span className="text-sm text-muted-foreground">
                        {hasOrangeBackground
                          ? "Orange background selected"
                          : ""}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={selectedImages.length >= 4}
                      className="text-community-green hover:text-community-green hover:bg-community-green/10"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Photo ({selectedImages.length}/4)
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPoll(!showPoll)}
                      className={cn(
                        "text-community-blue hover:text-community-blue hover:bg-community-blue/10",
                        showPoll && "bg-community-blue/10 text-community-blue",
                      )}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Poll
                    </Button>
                  </div>

                  <Button
                    onClick={handlePost}
                    disabled={!canPost}
                    className="bg-gradient-to-r from-primary to-community-blue"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Action Buttons for Homepage */}
        {showActionButtons && (
          <div className="flex items-center justify-center space-x-4 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={openWithImage}
              className="text-community-green hover:text-community-green hover:bg-community-green/10"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Image
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={openWithPoll}
              className="text-community-blue hover:text-community-blue hover:bg-community-blue/10"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
