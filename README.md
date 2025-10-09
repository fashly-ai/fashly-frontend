# Fashly - Virtual Try-On Fashion App

A modern, responsive web application for virtual glasses try-on experiences built with Next.js and React.

## 🚀 Features

### Core Functionality
- **Virtual Try-On**: Upload selfies and try on different glasses virtually
- **Product Browsing**: Browse through various glasses categories, brands, and styles
- **User Profiles**: Manage personal information, try-on history, and preferences
- **Shopping Cart**: Add items to cart with quantity management
- **Points System**: Earn points through social sharing and engagement

### Pages & Navigation
- **Landing Page**: Welcome screen with call-to-action
- **Sign Up**: Multiple authentication options (Google, Facebook, Email)
- **Quick Setup**: Profile creation with basic info and photo upload
- **Earn Points**: Social sharing and points earning interface
- **Product Catalog**: Comprehensive glasses browsing with filters
- **Try-On Result**: View and share virtual try-on results
- **Profile Management**: Complete user profile with tabs for:
  - Try-ons history
  - Liked items
  - Style recommendations
  - Shopping cart
  - Settings

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState)
- **Navigation**: Next.js Router

## 📁 Project Structure

```
fashly-fe/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── signup/
│   │   └── page.tsx          # Sign up page with email/OTP auth
│   ├── setup/
│   │   └── page.tsx          # Quick setup page
│   ├── earn-points/
│   │   └── page.tsx          # Points earning page
│   ├── products/
│   │   └── page.tsx          # Product catalog
│   ├── try-on-result/
│   │   └── page.tsx          # Try-on results
│   └── profile/
│       └── page.tsx          # User profile
├── lib/
│   └── axios.ts              # Axios instance with base configuration
├── public/                   # Static assets
├── .env.local                # Environment variables (create this)
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Gray scale (gray-50 to gray-900)
- **Accent**: Purple (purple-50 to purple-700)
- **Success**: Green (green-500, green-600)
- **Warning**: Yellow (yellow-100, yellow-900)
- **Error**: Red (red-500, red-600)

### Typography
- **Headers**: `text-lg font-bold` (18px, bold)
- **Body**: `text-sm` (14px, regular)
- **Small**: `text-xs` (12px, regular)

### Components
- **Buttons**: Rounded corners, hover effects, consistent padding
- **Cards**: White background, gray borders, rounded corners
- **Navigation**: Fixed bottom navigation, tab-based interface
- **Headers**: Consistent height, back navigation, page titles

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fashly-fe
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
   
   > **Note**: The API URL should point to your backend server. Update this value based on your environment (development, staging, production).

4. **Run the development server**
```bash
npm run dev
# or
pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔌 API Integration

The application uses Axios for HTTP requests with a centralized configuration in `lib/axios.ts`.

### Configuration

The Axios instance is configured with:
- Base URL from environment variable `NEXT_PUBLIC_API_URL`
- Default headers for JSON content
- Automatic error handling

### Authentication Endpoints

**Sign In with Email**
```typescript
POST /auth/sign-in
Body: { email: string }
Response: OTP sent to email
```

**Verify OTP**
```typescript
POST /auth/sign-in-verify
Body: { email: string, code: string }
Response: {
  success: boolean;
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
    firstName?: string;
    lastName?: string;
  };
  isNewUser: boolean;
}
```

### Profile Endpoints

**Get Profile**
```typescript
GET /api/profile
Headers: { Authorization: Bearer <token> }
Response: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  height: string | null;
  weight: number | null;
  weightUnit: string | null;
  profileImageUrl: string | null;
  phoneNumber: string | null;
  gender: string | null;
  bio: string | null;
  location: string | null;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Update Profile**
```typescript
PUT /api/profile
Headers: { Authorization: Bearer <token> }
Body: {
  firstName?: string;
  lastName?: string;
  height?: string;
  weight?: number;
  weightUnit?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  location?: string;
}
```

### Glasses/Products Endpoints

**Get Glasses List**
```typescript
GET /api/glasses?sortBy=name&sortOrder=ASC&page=1&limit=20
Headers: { Authorization: Bearer <token> }
Response: {
  data: [
    {
      id: string;
      name: string;
      productUrl: string;
      imageUrl: string;
      allImages: string[];
      brand: string;
      category: string;
      price: string;
      availability: string | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }
  ];
  pagination: {
    total: number;
    page: string;
    limit: string;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

**Query Parameters:**
- `sortBy`: Field to sort by (e.g., "name", "price", "createdAt")
- `sortOrder`: Sort direction ("ASC" or "DESC")
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### Authentication Flow

1. User enters email → OTP sent
2. User enters 6-digit OTP → Verification
3. On success:
   - Access token stored in localStorage
   - User data stored in localStorage
   - New users → redirected to `/setup`
   - Existing users → redirected to `/products`

### Usage Example

```typescript
import axios from '@/lib/axios';
import { setAuthToken, setUser, getAuthToken, isAuthenticated } from '@/lib/auth';

// Send OTP
const response = await axios.post('/auth/sign-in', { email });

// Verify OTP
const verifyResponse = await axios.post('/auth/sign-in-verify', { 
  email, 
  code: otpString 
});

// Store authentication
setAuthToken(verifyResponse.data.accessToken);
setUser(verifyResponse.data.user);

// Check authentication
if (isAuthenticated()) {
  // User is logged in
}

// All subsequent requests automatically include Bearer token
const data = await axios.get('/protected-endpoint');
```

## 📱 User Flow

### Onboarding
1. **Landing Page** → Click "Get Started"
2. **Sign Up** → Choose authentication method
3. **Quick Setup** → Add basic info and upload photo
4. **Earn Points** → Share on social media (optional)

### Shopping Experience
1. **Product Catalog** → Browse glasses by category
2. **Filter & Search** → Use filters and search functionality
3. **Try On** → Virtual try-on experience
4. **Results** → View and share try-on results
5. **Add to Cart** → Purchase or save for later

### Profile Management
1. **Profile Tab** → View try-on history
2. **Likes Tab** → Manage saved items
3. **Style Tab** → Get personalized recommendations
4. **Cart Tab** → Manage shopping cart
5. **Settings Tab** → Update profile and preferences

## 🎯 Key Features

### Virtual Try-On
- Upload selfie photos
- Real-time glasses overlay
- Multiple frame styles and brands
- Share results on social media

### Smart Recommendations
- Face shape analysis
- Style occasion matching
- Trending items
- Personalized suggestions

### Shopping Experience
- Advanced filtering (brand, style, color, price)
- Search functionality with suggestions
- Recently tried items
- Shopping cart with quantity management

### User Engagement
- Points system for sharing
- Social media integration
- Try-on history tracking
- Wishlist management

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- Consistent component structure
- Responsive design principles

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: Primary target (320px+)
- **Tablet**: Secondary support (768px+)
- **Desktop**: Enhanced experience (1024px+)

### Mobile-First Approach
- Touch-friendly interface
- Optimized navigation
- Swipe gestures support
- Fast loading times

## 🎨 UI/UX Principles

### Design Philosophy
- **Minimalist**: Clean, uncluttered interface
- **Intuitive**: Easy navigation and clear actions
- **Accessible**: High contrast, readable fonts
- **Consistent**: Unified design language

### User Experience
- **Fast**: Optimized performance
- **Smooth**: Fluid animations and transitions
- **Engaging**: Interactive elements and feedback
- **Personalized**: Tailored recommendations

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel
```

### Environment Variables
Create a `.env.local` file for environment-specific configurations:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_APP_NAME=Fashly
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@fashly.com or join our Slack channel.

## 🔮 Roadmap

### Upcoming Features
- [ ] Advanced AR try-on
- [ ] Video try-on capabilities
- [ ] AI-powered style recommendations
- [ ] Social features and community
- [ ] Mobile app (React Native)
- [ ] Integration with e-commerce platforms

### Performance Improvements
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Caching strategies
- [ ] Bundle size optimization

---

**Built with ❤️ by the Fashly Team**