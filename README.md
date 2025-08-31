# Tripare – SpaceX Launch Explorer

A modern React Native app built with Expo SDK 53 that provides a maps-first exploration experience for SpaceX launches and launchpads.

## � Features

### Core Functionality
- **Launch List**: Browse SpaceX launches with infinite scroll, search, and pull-to-refresh
- **Launch Details**: Comprehensive launch information with mission details and launchpad data
- **Interactive Maps**: View launchpad locations with satellite/standard map views
- **Native Navigation**: One-tap directions to launchpads via device's native Maps app
- **User Location**: Show distance from user to launchpads with permission handling

### Technical Features
- **TypeScript**: Fully typed for better development experience
- **React Query**: Efficient data fetching with caching and background updates
- **Error Boundaries**: Graceful error handling and recovery
- **Performance Optimized**: Memoized components and efficient list rendering
- **Production Ready**: Clean state management, loading states, and error handling

## 📱 Screenshots

*Screenshots will be added after testing on physical devices*

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd spaceX

# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android  
npx expo start --android
```

## 🗺️ Maps Implementation

### Libraries Used
- **react-native-maps**: Primary mapping solution with native performance
- **expo-location**: Location permissions and user positioning
- **expo-linking**: Deep linking to native Maps applications

### Map Features
- **Launchpad Markers**: Custom rocket icons showing active/inactive status
- **User Location**: Real-time user position with distance calculations
- **Map Controls**: Toggle between standard and satellite views
- **Native Integration**: Seamless handoff to Apple Maps/Google Maps

### Permission Flows
The app implements a comprehensive permission system:

1. **Location Permission Request**: 
   - Graceful prompting with clear messaging
   - Fallback UI when permissions are denied
   - Contextual permission requests (only when needed)

2. **Permission States**:
   - **Granted**: Full map functionality with user location
   - **Denied**: Limited functionality with clear explanation
   - **Not Determined**: Prompts user with benefits explanation

3. **Error Handling**:
   - Network connectivity issues
   - Location service unavailability  
   - Maps application not available

## 🏗️ Project Architecture

### Folder Structure
```
app/
├── (tabs)/              # Tab navigation screens
│   ├── index.tsx        # Launch list screen
│   └── explore.tsx      # Launchpad map overview
├── launch/[id].tsx      # Dynamic launch detail screen
├── _layout.tsx          # Root layout with providers
└── +not-found.tsx       # 404 screen

api/
└── spacex.ts            # SpaceX API integration

components/
├── LaunchListItem.tsx   # Memoized launch list item
├── SearchBar.tsx        # Search functionality
├── LoadingState.tsx     # Loading UI component
├── ErrorState.tsx       # Error UI component
├── EmptyState.tsx       # Empty state UI
└── ErrorBoundary.tsx    # Error boundary wrapper

hooks/
├── useLaunches.ts       # Launch data fetching
├── useLaunchpad.ts      # Launchpad data fetching
└── useUserLocation.ts   # Location management

types/
└── spacex.ts            # TypeScript type definitions

utils/
├── maps.ts              # Map utilities and calculations
└── logger.ts            # Logging and debugging

providers/
└── QueryProvider.tsx    # React Query setup
```

### API Integration
- **Base URL**: `https://api.spacexdata.com`
- **Endpoints Used**:
  - `/v5/launches` - Launch data with pagination
  - `/v4/launchpads/:id` - Launchpad details
- **Caching Strategy**: 5-minute stale time, 30-minute cache time
- **Error Handling**: Automatic retries with exponential backoff

### State Management
- **React Query**: Server state and caching
- **React Context**: Global providers (Error Boundary, Query Client)
- **Local State**: Component-specific state with hooks
- **No Redux**: Simplified state management for better maintainability

## 🎨 Design System

### Theme
- **Primary Color**: #0066CC (SpaceX Blue)
- **Success**: #34C759 (Green)
- **Warning**: #FF9500 (Orange)
- **Error**: #FF3B30 (Red)
- **Background**: #F5F5F5 (Light Gray)

### Typography
- **Primary Font**: SF Pro (iOS) / Roboto (Android)
- **Monospace**: SpaceMono (for technical data)
- **Consistent Sizing**: 12px, 14px, 16px, 18px, 20px, 24px

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Consistent padding and corner radius
- **Lists**: Optimized for performance with proper item heights

## 🧪 Testing

### Manual Testing Checklist
- [ ] Launch list loads and displays correctly
- [ ] Search functionality works
- [ ] Pull-to-refresh updates data
- [ ] Infinite scroll loads more launches
- [ ] Launch details screen shows complete information
- [ ] Map displays launchpad locations
- [ ] Location permission flow works
- [ ] Native maps integration works
- [ ] Error states display properly
- [ ] Loading states are shown appropriately

### Performance Testing
- [ ] List scrolling is smooth (60fps)
- [ ] Map interactions are responsive
- [ ] Memory usage is reasonable
- [ ] Battery drain is minimal
- [ ] Network requests are optimized

## 🚀 Deployment

### Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build --platform all

# Submit to app stores
eas submit --platform all
```

### Environment Configuration
- Development: Local API calls with debugging
- Production: Optimized builds with error reporting

## 🐛 Known Issues & Limitations

1. **Map Performance**: Large numbers of markers may impact performance
2. **Offline Support**: Limited offline functionality (future enhancement)
3. **Background Updates**: No background sync (future enhancement)

## 🔮 Future Enhancements

1. **Push Notifications**: Launch reminders and updates
2. **Offline Support**: Cached data for offline viewing
3. **Favorites**: Save favorite launches and launchpads
4. **Advanced Filtering**: Filter by date, status, rocket type
5. **Sharing**: Share launch details via social media
6. **Launch Calendar**: Calendar view of upcoming launches

## 📝 License

This project is for demonstration purposes. SpaceX data is used via their public API.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Test thoroughly on both platforms
5. Submit a pull request

## 📞 Support

For issues or questions, please create an issue in the GitHub repository.

---

Built with ❤️ using Expo SDK 53, React Native, and TypeScript