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
│   │   └── page.tsx          # Sign up page
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
├── public/                   # Static assets
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
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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