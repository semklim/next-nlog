# Blog Application

A modern, responsive blog web application built with Next.js 15+ and TypeScript. Users can create and read blog posts with a comment system and internationalization support.

## 🚀 Features

- **CRUD Operations**: Create, and read blog posts
- **Comment System**: Interactive commenting on blog posts
- **Internationalization**: Multi-language support (English/Ukrainian)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live data synchronization with Firestore
- **Form Validation**: Robust validation using Zod
- **State Management**: Centralized state with Redux Toolkit
- **Modern UI**: Beautiful components with shadcn/ui
- **SEO Optimized**: Proper metadata and structured data

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Redux Toolkit
- **Form Validation**: Zod
- **Internationalization**: next-intl

### Backend & Database

- **Database**: Firestore (Firebase)

### Development & Testing

- **Testing**: Jest + Playwright
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Firestore enabled

### Setup Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd example-app-router
```

2. **Install dependencies**

```bash
npm install
```

## 🔥 Firebase Setup

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Get your Firebase configuration
   - Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Internationalized routes
│   │   ├── create/        # Post creation page
│   │   ├── post/[id]/     # Individual post pages
│   │   └── page.tsx       # Home page (posts list)
├── components/
│   ├── blog/              # Blog-specific components
│   │   ├── PostList/      # Post listing with filters & pagination
│   │   ├── PostForm.tsx   # Post creation/editing form
│   │   ├── PostDetail.tsx # Individual post view
│   │   └── ComentSection/ # Comments functionality
│   ├── layout/            # Layout components
│   └── ui/                # UI components (shadcn/ui)
├── lib/
│   ├── firebase/          # Firebase configuration & services
│   ├── validations/       # Zod validation schemas
│   └── actions/           # Server actions
├── store/                 # Redux store
│   └── slices/            # Redux slices
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run Jest tests
npm run test:e2e     # Run Playwright E2E tests

# Linting & Type Checking
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🌍 Internationalization

The application supports multiple languages:

- English (en)
- Ukrainian (uk)

Language files are located in the `messages/` directory. To add a new language:

1. Create a new JSON file in `messages/`
2. Update the `i18n/routing.ts` configuration
3. Add the locale to your middleware configuration

## 📱 Responsive Design

The application follows a mobile-first approach:

- **Mobile**: Stacked layout with collapsible navigation
- **Tablet**: Optimized spacing and typography
- **Desktop**: Multi-column layout with sidebar

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
