import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

const { width: screenWidth } = Dimensions.get("window");

interface PostCreationProps {
  onPost: (post: any) => void;
  placeholder?: string;
}

const PostCreation: React.FC<PostCreationProps> = ({
  onPost,
  placeholder = "What's on your mind?",
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const handleImagePicker = () => {
    if (selectedImages.length >= 4) {
      Toast.show({
        type: "info",
        text1: "Maximum 4 images allowed",
        text2: "You can only select up to 4 images per post",
      });
      return;
    }

    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        selectionLimit: 4 - selectedImages.length,
      },
      (response) => {
        if (response.assets) {
          setSelectedImages([...selectedImages, ...response.assets]);
        }
      },
    );
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

  const canPost = () => {
    if (postContent.trim()) return true;
    if (selectedImages.length > 0) return true;
    if (
      showPoll &&
      pollQuestion.trim() &&
      pollOptions.filter((opt) => opt.trim()).length >= 2
    ) {
      return true;
    }
    return false;
  };

  const handlePost = () => {
    const post = {
      content: postContent,
      images: selectedImages,
      poll: showPoll
        ? {
            question: pollQuestion,
            options: pollOptions
              .filter((opt) => opt.trim())
              .map((text) => ({ text, votes: 0 })),
            totalVotes: 0,
            expiresIn: "24 hours",
            isEnded: false,
          }
        : null,
      timestamp: new Date(),
    };

    onPost(post);

    // Reset form
    setPostContent("");
    setSelectedImages([]);
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setIsModalVisible(false);

    Toast.show({
      type: "success",
      text1: "Post created!",
      text2: "Your post has been shared with the community",
    });
  };

  const renderSelectedImages = () => {
    if (selectedImages.length === 0) return null;

    return (
      <View style={styles.imagesContainer}>
        <Text style={styles.sectionTitle}>Selected Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedImages.map((image, index) => (
            <View key={index} style={styles.imagePreview}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Icon name="x" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderPollCreator = () => {
    if (!showPoll) return null;

    return (
      <View style={styles.pollContainer}>
        <View style={styles.pollHeader}>
          <Text style={styles.sectionTitle}>Create Poll</Text>
          <View style={styles.pollInfo}>
            <Icon name="clock" size={16} color={colors.textSecondary} />
            <Text style={styles.pollInfoText}>Expires in 24 hours</Text>
          </View>
        </View>

        <TextInput
          style={styles.pollQuestionInput}
          placeholder="Ask a question..."
          value={pollQuestion}
          onChangeText={setPollQuestion}
          placeholderTextColor={colors.textSecondary}
        />

        <View style={styles.pollOptionsContainer}>
          {pollOptions.map((option, index) => (
            <View key={index} style={styles.pollOptionRow}>
              <TextInput
                style={styles.pollOptionInput}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChangeText={(value) => updatePollOption(index, value)}
                placeholderTextColor={colors.textSecondary}
              />
              {pollOptions.length > 2 && (
                <TouchableOpacity
                  style={styles.removePollOptionButton}
                  onPress={() => removePollOption(index)}
                >
                  <Icon name="x" size={16} color={colors.destructive} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {pollOptions.length < 4 && (
            <TouchableOpacity
              style={styles.addPollOptionButton}
              onPress={addPollOption}
            >
              <Icon name="plus" size={16} color={colors.primary} />
              <Text style={styles.addPollOptionText}>Add Option</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Post Creation Trigger */}
      <TouchableOpacity
        style={styles.triggerContainer}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/40?img=1" }}
          style={styles.avatar}
        />
        <View style={styles.triggerInput}>
          <Text style={styles.triggerText}>{placeholder}</Text>
        </View>
      </TouchableOpacity>

      {/* Post Creation Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity
              style={[
                styles.postButton,
                !canPost() && styles.postButtonDisabled,
              ]}
              onPress={handlePost}
              disabled={!canPost()}
            >
              <Text
                style={[
                  styles.postButtonText,
                  !canPost() && styles.postButtonTextDisabled,
                ]}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Author Info */}
            <View style={styles.authorInfo}>
              <Image
                source={{ uri: "https://i.pravatar.cc/40?img=1" }}
                style={styles.avatar}
              />
              <Text style={styles.authorName}>John Doe</Text>
            </View>

            {/* Post Content Input */}
            <TextInput
              style={styles.contentInput}
              placeholder={placeholder}
              value={postContent}
              onChangeText={setPostContent}
              multiline
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />

            {/* Selected Images */}
            {renderSelectedImages()}

            {/* Poll Creator */}
            {renderPollCreator()}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                selectedImages.length >= 4 && styles.actionButtonDisabled,
              ]}
              onPress={handleImagePicker}
              disabled={selectedImages.length >= 4}
            >
              <Icon
                name="image"
                size={20}
                color={
                  selectedImages.length >= 4
                    ? colors.textSecondary
                    : colors.communityGreen
                }
              />
              <Text
                style={[
                  styles.actionButtonText,
                  { color: colors.communityGreen },
                  selectedImages.length >= 4 && { color: colors.textSecondary },
                ]}
              >
                Photo ({selectedImages.length}/4)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                showPoll && styles.actionButtonActive,
              ]}
              onPress={() => setShowPoll(!showPoll)}
            >
              <Icon
                name="bar-chart-2"
                size={20}
                color={showPoll ? colors.communityBlue : colors.communityBlue}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  { color: colors.communityBlue },
                ]}
              >
                Poll
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  triggerContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  triggerInput: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  triggerText: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  postButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: colors.muted,
  },
  postButtonText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.primaryForeground,
  },
  postButtonTextDisabled: {
    color: colors.mutedForeground,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  authorName: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  contentInput: {
    fontSize: typography.lg,
    color: colors.textPrimary,
    textAlignVertical: "top",
    minHeight: 120,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  imagePreview: {
    position: "relative",
    marginRight: 12,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  pollContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  pollHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pollInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  pollInfoText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  pollQuestionInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: typography.base,
    color: colors.textPrimary,
    marginBottom: 16,
    fontWeight: typography.medium,
  },
  pollOptionsContainer: {
    gap: 8,
  },
  pollOptionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pollOptionInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  removePollOptionButton: {
    marginLeft: 12,
    padding: 8,
  },
  addPollOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  addPollOptionText: {
    fontSize: typography.base,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: typography.medium,
  },
  actionsContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  actionButtonActive: {
    backgroundColor: colors.secondary,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    marginLeft: 8,
  },
});

export default PostCreation;
