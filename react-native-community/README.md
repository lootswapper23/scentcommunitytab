# Community App - React Native iOS

A mobile-first social community app built with React Native for iOS, featuring post creation, interactive polls, threaded comments, and social sharing.

## Features

- 📱 **Mobile-First Design**: Optimized for iOS with native feel
- 📝 **Post Creation**: Text posts with up to 4 images and polls
- 🗳️ **Interactive Polls**: Visual voting with progressive disclosure
- 💬 **Threaded Comments**: Nested replies with like functionality
- ❤️ **Post Interactions**: Like/unlike posts and comments
- 📤 **Social Sharing**: Share posts via iOS native sharing
- 🔄 **Pull-to-Refresh**: Native refresh functionality
- 🎨 **Modern UI**: Clean, accessible design with haptic feedback

## Tech Stack

- **React Native 0.73**: Latest stable version
- **TypeScript**: Full type safety
- **React Navigation 6**: Native navigation patterns
- **React Native Vector Icons**: Feather icons
- **React Native Image Picker**: Photo selection
- **React Native Share**: Native sharing capabilities
- **React Native Linear Gradient**: Beautiful gradients
- **React Native Toast Message**: Native-style notifications

## Prerequisites

- Node.js 16 or higher
- Xcode 14+ (for iOS development)
- CocoaPods (for iOS dependencies)
- iOS Simulator or physical iOS device

## Installation

1. **Clone and install dependencies:**

```bash
cd react-native-community
npm install

# Install iOS dependencies
cd ios && pod install && cd ..
```

2. **Start Metro bundler:**

```bash
npm start
```

3. **Run on iOS:**

```bash
# Run on iOS Simulator
npm run ios

# Or run on specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro"

# Run on physical device (requires provisioning)
npx react-native run-ios --device
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── PostCard.tsx     # Main post display component
│   ├── PostCreation.tsx # Post creation modal
│   ├── PollComponent.tsx # Interactive poll component
│   ├── CommentSection.tsx # Threaded comments
│   └── SocialShareModal.tsx # Native sharing
├── screens/             # Screen components
│   └── HomeScreen.tsx   # Main feed screen
├── constants/           # App constants
│   ├── colors.ts        # Color palette
│   └── typography.ts    # Typography scale
└── App.tsx             # Main app component
```

## Key Components

### PostCard Component

- Displays posts with author info, content, images, and polls
- Handles like/unlike functionality with visual feedback
- Supports image galleries with overflow indicators
- Integrates social sharing and commenting

### PollComponent

- Interactive voting with large touch targets
- Progressive disclosure of results
- Animated progress bars with gradients
- Prevents multiple votes per user

### CommentSection

- Threaded replies with proper nesting
- Individual like counts for comments
- Reply functionality with mentions
- Collapsible thread structure

### PostCreation

- Full-screen modal for post creation
- Image picker with 4-image limit
- Poll creator with up to 4 options
- Live preview and validation

## iOS-Specific Features

### Native Integration

- **Haptic Feedback**: iOS-style haptic responses for interactions
- **Native Sharing**: Uses iOS share sheet for social sharing
- **Status Bar**: Properly configured for iOS appearance
- **Safe Areas**: Respects iOS safe area insets
- **Pull-to-Refresh**: Native iOS refresh control

### Design Patterns

- **Human Interface Guidelines**: Follows iOS design principles
- **Touch Targets**: 44pt minimum touch targets
- **Visual Hierarchy**: iOS-style typography and spacing
- **Animations**: Native-feeling transitions and micro-interactions

## Customization

### Colors

Edit `src/constants/colors.ts` to customize the app's color palette:

```typescript
export const colors = {
  primary: "#6366f1",
  communityBlue: "#3b82f6",
  // ... other colors
};
```

### Typography

Modify `src/constants/typography.ts` for font sizing and weights:

```typescript
export const typography = {
  base: 16,
  lg: 18,
  // ... other sizes
};
```

## Building for Production

### Development Build

```bash
# Debug build for testing
npx react-native run-ios --configuration Debug
```

### Release Build

```bash
# Production build
npx react-native run-ios --configuration Release
```

### App Store Build

```bash
# Build for App Store distribution
xcodebuild -workspace ios/CommunityApp.xcworkspace -scheme CommunityApp -configuration Release -destination generic/platform=iOS archive -archivePath build/CommunityApp.xcarchive

# Export IPA
xcodebuild -exportArchive -archivePath build/CommunityApp.xcarchive -exportPath build -exportOptionsPlist ios/exportOptions.plist
```

## Performance Optimization

### Image Handling

- Images are automatically resized for optimal performance
- LazyLoading implemented for feed scrolling
- Memory-efficient image caching

### State Management

- Optimized React state updates
- Minimal re-renders with proper key usage
- Efficient comment thread handling

### Bundle Size

- Tree-shaking enabled for smaller bundles
- Optimized icon imports
- Lazy-loaded components where appropriate

## Troubleshooting

### Common Issues

1. **Metro bundler issues:**

```bash
npx react-native start --reset-cache
```

2. **iOS build failures:**

```bash
cd ios && pod install && cd ..
```

3. **Image picker not working:**

- Ensure camera/photo library permissions in Info.plist
- Check iOS simulator limitations

4. **Share functionality not working:**

- Test on physical device (simulator may have limitations)
- Verify app is properly signed

### Debugging

Enable debugging in development:

```bash
# Enable React Native debugger
npx react-native start --verbose

# iOS device debugging
npx react-native log-ios
```

## Contributing

1. Follow React Native best practices
2. Use TypeScript for all new code
3. Test on multiple iOS devices/simulators
4. Ensure accessibility compliance
5. Follow iOS Human Interface Guidelines

## License

MIT License - see LICENSE file for details.
