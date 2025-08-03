import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Copy,
  MessageCircle,
  Check,
  Facebook,
  Instagram,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialShareProps {
  postId: number;
  postContent: string;
  author: string;
}

export default function SocialShare({
  postId,
  postContent,
  author,
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const postUrl = `${window.location.origin}/post/${postId}`;
  const shareText = `Check out this post by ${author}: "${postContent.slice(0, 100)}${postContent.length > 100 ? "..." : ""}"`;

  // Custom X (Twitter) icon component
  const XIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  const shareOptions = [
    {
      name: "Copy Link",
      icon: Copy,
      color: "bg-muted text-foreground",
      action: () => copyToClipboard(),
    },
    {
      name: "Messages",
      icon: MessageCircle,
      color: "bg-community-blue text-white",
      action: () => shareViaMessages(),
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 text-white",
      action: () => shareToFacebook(),
    },
    {
      name: "X",
      icon: XIcon,
      color: "bg-black text-white",
      action: () => shareToX(),
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      action: () => shareToInstagram(),
    },
  ];

  const copyToClipboard = async () => {
    try {
      // Check if Clipboard API is available and permissions are granted
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Link copied!",
          description: "The post link has been copied to your clipboard.",
        });
        return;
      }

      // Fallback method using deprecated execCommand
      fallbackCopyToClipboard(postUrl);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Try fallback method if clipboard API fails
      fallbackCopyToClipboard(postUrl);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      // Try to copy using the deprecated execCommand
      const successful = document.execCommand('copy');

      document.body.removeChild(textArea);

      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Link copied!",
          description: "The post link has been copied to your clipboard.",
        });
      } else {
        // If all methods fail, show a toast with manual copy option
        toast({
          title: "Copy manually",
          description: "Please copy this link manually: " + text,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Fallback copy failed: ", err);
      // Final fallback - show a toast with the URL
      toast({
        title: "Copy failed",
        description: "Please copy this link manually: " + text,
        variant: "destructive",
      });
    }
  };

  const shareViaMessages = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Community Post",
          text: shareText,
          url: postUrl,
        });
      } else {
        // Fallback for devices without Web Share API
        copyToClipboard();
      }
    } catch (err) {
      // User cancelled sharing or sharing failed
      if (err.name !== 'AbortError') {
        console.error("Sharing failed: ", err);
        copyToClipboard();
      }
    }
  };



  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };



  const shareToInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy the link
    copyToClipboard();
    // You could show a message here about how to share on Instagram
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Link Preview */}
          <div className="p-3 bg-secondary rounded-lg space-y-2">
            <div className="text-sm font-medium">Community Post</div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {shareText}
            </div>
            <div className="flex items-center space-x-2">
              <Input
                value={postUrl}
                readOnly
                className="flex-1 text-xs bg-background"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-community-green" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <Badge
                variant="secondary"
                className="text-xs text-community-green"
              >
                Link copied!
              </Badge>
            )}
          </div>

          {/* Share Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.name}
                  variant="outline"
                  className={cn(
                    "h-16 flex-col space-y-1 border-2",
                    option.color.includes("gradient")
                      ? `bg-gradient-to-r ${option.color.split("bg-gradient-to-r ")[1]}`
                      : option.color,
                  )}
                  onClick={option.action}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{option.name}</span>
                </Button>
              );
            })}
          </div>


        </div>
      </DialogContent>
    </Dialog>
  );
}
