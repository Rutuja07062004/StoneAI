<div align="center">
  <h1>💎 StoneAI</h1>
  <p><b>An intelligent geological companion that uses AI to identify minerals, track your discoveries, and provide a comprehensive field guide.</b></p>
</div>

---

## 🌟 Overview

**StoneAI** is a premium React Native mobile application designed for geologists, hobbyists, and mineral enthusiasts. By leveraging the power of the **Gemini Vision API**, StoneAI can identify minerals from your camera instantly. It also serves as a comprehensive digital field guide and a personal journal to log your geological discoveries with precise geospatial tagging.

## ✨ Key Features

- **🔍 AI-Powered Identification**: Capture or upload photos of stones/minerals and get instant, accurate identification using the Gemini Vision API.
- **🗺️ Geological Location Tagging**: Automatically record GPS coordinates and reverse-geocode addresses for every discovery you log in your collection.
- **📖 Comprehensive Field Guide**: Browse a rich, searchable encyclopedia of minerals, categorized by properties, with a luxurious and intuitive user interface.
- **🔐 Secure Authentication**: Full JWT-based user authentication system ensuring your mineral collection is safely backed up and accessible across devices.
- **📊 Admin Dashboard**: Built-in API profiling to monitor backend health, track request latency, and manage system errors in real-time.

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native & [Expo](https://expo.dev/) (SDK 54)
- **Navigation**: Expo Router (File-based routing)
- **Maps & Location**: `react-native-maps` & `expo-location`
- **AI Integration**: `@google/generative-ai` (Gemini Vision API)
- **Camera & File System**: `expo-camera`, `expo-image-picker`, `expo-file-system`

### Backend (API Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Architecture**: RESTful API design

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A Google Gemini API Key

### 1. Clone the repository

```bash
git clone https://github.com/Rutuja07062004/StoneAI.git
cd StoneAI
```

### 2. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend development server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal window at the project root directory:

```bash
npm install
```

Create a `.env` file in the root directory (or use Expo's `app.json` config) and add your Gemini API Key and Backend URL:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

Start the Expo development server:

```bash
npx expo start
```

Press `a` to open on an Android emulator, `i` to open on an iOS simulator, or scan the QR code with the Expo Go app on your physical device.

## 📱 Project Structure

```text
StoneAI/
├── backend/                  # Node.js / Express backend
│   ├── models/               # Mongoose schemas (User, Discovery, etc.)
│   ├── middleware/           # JWT auth & API profiling middleware
│   └── server.js             # Main backend entry point
├── src/
│   ├── app/                  # Expo Router file-based screens
│   ├── assets/               # Images, fonts, and mineral assets
│   ├── components/           # Reusable UI components (GlassCard, GlowButton, etc.)
│   ├── constants/            # Theme, color, and config constants
│   ├── hooks/                # Custom React hooks (useLocation, useMinerals, etc.)
│   └── services/             # API services, Gemini AI client, & Storage logic
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Rutuja07062004/StoneAI/issues).

## 📄 License

This project is licensed under the MIT License.
