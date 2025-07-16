import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface PollOption {
  text: string;
  votes: number;
}

interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVoted?: string;
  expiresIn: string;
  isEnded?: boolean;
}

interface PollComponentProps {
  poll: Poll;
  onVote: (optionIndex: number) => void;
}

const PollComponent: React.FC<PollComponentProps> = ({ poll, onVote }) => {
  const hasVoted = !!poll.userVoted;
  const isPollEnded = poll.isEnded;
  const showResults = hasVoted || isPollEnded;

  const handleVote = (optionIndex: number) => {
    if (!hasVoted && !isPollEnded) {
      onVote(optionIndex);
    }
  };

  const renderOption = (option: PollOption, index: number) => {
    const percentage = (option.votes / poll.totalVotes) * 100;
    const isVoted = poll.userVoted === option.text;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.optionContainer,
          isVoted && styles.votedOption,
          (hasVoted || isPollEnded) && !isVoted && styles.dimmedOption,
        ]}
        onPress={() => handleVote(index)}
        disabled={hasVoted || isPollEnded}
        activeOpacity={0.8}
      >
        {/* Progress Bar Background */}
        {showResults && (
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: `${percentage}%`,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.primary + "20", colors.communityBlue + "20"]}
                style={styles.progressGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
        )}

        <View style={styles.optionContent}>
          <Text style={[styles.optionText, isVoted && styles.votedText]}>
            {option.text}
          </Text>

          {showResults ? (
            <View style={styles.resultsContainer}>
              <Text style={[styles.voteCount, isVoted && styles.votedText]}>
                {option.votes}
              </Text>
              <Text style={[styles.percentage, isVoted && styles.votedText]}>
                {percentage.toFixed(0)}%
              </Text>
            </View>
          ) : (
            <View style={styles.radioButton}>
              <View style={styles.radioInner} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{poll.question}</Text>

      <View style={styles.optionsContainer}>
        {poll.options.map((option, index) => renderOption(option, index))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {showResults
            ? `${poll.totalVotes} total votes`
            : "Vote to see results"}
        </Text>
        <Text style={styles.footerText}>
          {isPollEnded ? "Poll ended" : `Expires in ${poll.expiresIn}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accent + "30",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  question: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: 16,
    lineHeight: typography.base * 1.4,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    position: "relative",
    overflow: "hidden",
  },
  votedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dimmedOption: {
    opacity: 0.7,
  },
  progressContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressBar: {
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  progressGradient: {
    flex: 1,
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  optionText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    color: colors.textPrimary,
    flex: 1,
  },
  votedText: {
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  resultsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  voteCount: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.primary,
    marginRight: 12,
  },
  percentage: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
});

export default PollComponent;
