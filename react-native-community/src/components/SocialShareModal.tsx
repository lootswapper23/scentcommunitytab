import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Clipboard,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Share from "react-native-share";
import Toast from "react-native-toast-message";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
}

interface SocialShareModalProps {
  visible: boolean;
  onClose: () => void;
  post: Post;
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({
  visible,
  onClose,
  post,
}) => {
  const postUrl = `https://community.app/post/${post.id}`;
  const shareText = `Check out this post by ${post.author.name}: "${post.content.slice(
    0,
    100,
  )}${post.content.length > 100 ? "..." : ""}"`;

  const copyToClipboard = async () => {
    try {
      await Clipboard.setString(postUrl);
      Toast.show({
        type: "success",
        text1: "Link copied!",
        text2: "The post link has been copied to your clipboard",
        visibilityTime: 2000,
      });
      onClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to copy",
        text2: "Please try again",
      });
    }
  };

  const shareToSocial = async () => {
    try {
      const shareOptions = {
        title: "Community Post",
        message: shareText,
        url: postUrl,
      };

      await Share.open(shareOptions);
      onClose();
    } catch (error) {
      if (error.message !== "User did not share") {
        Toast.show({
          type: "error",
          text1: "Share failed",
          text2: "Please try again",
        });
      }
    }
  };

  const shareViaMessages = async () => {
    try {
      const shareOptions = {
        title: "Community Post",
        message: `${shareText}\n\n${postUrl}`,
        social: Share.Social.SMS,
      };

      await Share.shareSingle(shareOptions);
      onClose();
    } catch (error) {
      // Fallback to general share
      shareToSocial();
    }
  };

  const shareViaEmail = async () => {
    try {
      const subject = encodeURIComponent("Check out this Community post");
      const body = encodeURIComponent(`${shareText}\n\n${postUrl}`);
      const url = `mailto:?subject=${subject}&body=${body}`;

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        onClose();
      } else {
        shareToSocial();
      }
    } catch (error) {
      shareToSocial();
    }
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: "copy",
      color: colors.textSecondary,
      action: copyToClipboard,
    },
    {
      name: "Messages",
      icon: "message-circle",
      color: colors.communityBlue,
      action: shareViaMessages,
    },
    {
      name: "Email",
      icon: "mail",
      color: colors.communityGreen,
      action: shareViaEmail,
    },
    {
      name: "More Options",
      icon: "share",
      color: colors.primary,
      action: shareToSocial,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Share Post</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="x" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Post Preview */}
          <View style={styles.postPreview}>
            <Text style={styles.previewTitle}>Community Post</Text>
            <Text style={styles.previewText} numberOfLines={2}>
              {shareText}
            </Text>
            <View style={styles.urlContainer}>
              <Text style={styles.urlText} numberOfLines={1}>
                {postUrl}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyToClipboard}
              >
                <Icon name="copy" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Share Options */}
          <View style={styles.optionsContainer}>
            {shareOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.shareOption}
                onPress={option.action}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: option.color + "20" },
                  ]}
                >
                  <Icon name={option.icon} size={24} color={option.color} />
                </View>
                <Text style={styles.optionText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  postPreview: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  previewText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    lineHeight: typography.xs * 1.4,
    marginBottom: 12,
  },
  urlContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
  },
  urlText: {
    flex: 1,
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  shareOption: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  optionText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  cancelText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    color: colors.textSecondary,
  },
});

export default SocialShareModal;
