import { useMemo, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./components/Button";
import { Badge } from "./components/Badge";
import { Card } from "./components/Card";
import { design } from "./data/design";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { MyOrders } from "./pages/MyOrders";
import { WeeklyRanking } from "./pages/WeeklyRanking";
import { getTimeBasedGreeting } from "./utils/greeting";
import {
  pageVariants,
  staggerContainer,
  medalSpinVariants,
} from "./components/animations";
import { FloatingParticles } from "./components/FloatingParticles";
import { CoffeePourHero } from "./components/CoffeePourHero";
import { WeatherRecommendations } from "./components/WeatherRecommendations";
import { FlavorWheel } from "./components/FlavorWheel";
import { LiveStats } from "./components/LiveStats";
import { BaristaTips } from "./components/BaristaTips";
import { DailyChallenge } from "./components/DailyChallenge";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { api, type Product } from "./lib/api";

import { useMoodTheme } from "./hooks/useMoodTheme";
import { MyOrdersPreview } from "./components/MyOrdersPreview";

type ScreenId = (typeof design.screens)[number]["screenId"];

const screenMap = design.screens.reduce<
  Record<ScreenId, (typeof design.screens)[number]>
>(
  (acc, screen) => {
    acc[screen.screenId] = screen;
    return acc;
  },
  {} as Record<ScreenId, (typeof design.screens)[number]>,
);

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-body-lg text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(
    design.screens[0].screenId,
  );
  const [showOrders, setShowOrders] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>("energized");
  const { signOut } = useAuth();

  const screen = useMemo(() => screenMap[activeScreen], [activeScreen]);

  return (
    <div className="min-h-screen relative">
      {/* Background decoration */}

      {/* 🌟 SPECTACULAR FLOATING HEADER */}
      <motion.header
        className="sticky top-0 z-50 glass-frosted shadow-elevated backdrop-blur-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with shimmer effect */}
            <motion.h1
              className="text-6xl font-black gradient-text-animated cursor-pointer font-playfair"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {design.appName}
            </motion.h1>

            {/* Sign Out Button with glow */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={signOut}
                className="glow-primary neumorphism font-semibold"
              >
                ✨ Sign Out
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 relative z-10">
        {/* Page Title Section with 3D effect */}
        <motion.div
          className="crystal-effect rounded-2xl p-8 lift-3d"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">☕</div>
            <h2 className="text-5xl font-bold text-shimmer font-playfair">
              {screen.title}
            </h2>
          </div>
          <p className="text-lg text-text-secondary leading-relaxed">
            ✨ Explore the MoodBrew experience across key screens. Use the
            toggles below to preview the tailored UI states.
          </p>
        </motion.div>

        {/* 🎯 MODERN NAVIGATION BUTTONS */}
        <motion.section
          className="flex flex-wrap gap-4 p-6 glass rounded-3xl shadow-elevated"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {design.screens.map((item, index) => (
            <motion.div
              key={item.screenId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Button
                variant={
                  item.screenId === activeScreen && !showOrders
                    ? "primary"
                    : "outline"
                }
                onClick={() => {
                  setActiveScreen(item.screenId);
                  setShowOrders(false);
                }}
                className={`
                  font-semibold text-lg px-8 py-4 rounded-2xl
                  ${item.screenId === activeScreen && !showOrders
                    ? "shadow-elevated scale-105"
                    : "lift-3d neumorphism"
                  }
                  transition-all duration-300
                `}
              >
                {item.title}
              </Button>
            </motion.div>
          ))}

          {/* My Orders Button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * design.screens.length }}>
            <Button
              variant={showOrders && !showRanking ? "primary" : "outline"}
              onClick={() => { setShowOrders(true); setShowRanking(false); }}
              className={`font-semibold text-lg px-8 py-4 rounded-2xl ${showOrders && !showRanking ? "shadow-elevated scale-105" : "lift-3d neumorphism"} transition-all duration-300`}
            >
              🛍️ My Orders
            </Button>
          </motion.div>

          {/* Weekly Ranking Button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * (design.screens.length + 1) }}>
            <Button
              variant={showRanking ? "primary" : "outline"}
              onClick={() => { setShowRanking(true); setShowOrders(false); }}
              className={`font-semibold text-lg px-8 py-4 rounded-2xl ${showRanking ? "shadow-elevated scale-105" : "lift-3d neumorphism"} transition-all duration-300`}
            >
              🏆 Ranking
            </Button>
          </motion.div>
        </motion.section>

        {/* 🎨 MAIN CONTENT AREA WITH WAVE ANIMATION */}
        <section className="rounded-3xl crystal-effect p-10 shadow-elevated wave-animation overflow-hidden">
          <AnimatePresence mode="wait">
            {showRanking ? (
              <motion.div key="ranking" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <WeeklyRanking onBack={() => { setShowRanking(false); }} />
              </motion.div>
            ) : showOrders ? (
              <motion.div
                key="orders"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <MyOrders onBack={() => setShowOrders(false)} />
              </motion.div>
            ) : screen.screenId === "home" ? (
              <motion.div
                key="home"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <HomeScreen
                  onNavigate={setActiveScreen}
                  onShowOrders={() => setShowOrders(true)}
                  onSelectProduct={setSelectedProduct}
                  selectedMood={selectedMood}
                  onSelectMood={setSelectedMood}
                  data={screen.components}
                  interactions={design.interactions}
                />
              </motion.div>
            ) : null}
            {!showOrders && screen.screenId === "product_detail" && (
              <motion.div
                key="product_detail"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ProductDetailScreen
                  onBack={() => setActiveScreen("home")}
                  data={screen.components}
                />
              </motion.div>
            )}
            {!showOrders && screen.screenId === "weekly_ranking" && (
              <motion.div
                key="weekly_ranking"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <WeeklyRankingScreen
                  onNavigate={setActiveScreen}
                  data={screen.components}
                  interactions={design.interactions}
                />
              </motion.div>
            )}
            {!showOrders && screen.screenId === "cafe_detail" && (
              <motion.div
                key="cafe_detail"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <CafeDetailScreen
                  onBack={() => setActiveScreen("weekly_ranking")}
                  data={screen.components}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Product Detail Modal — rendered at root level so it overlays everything */}
      <ProductDetailModal
        product={selectedProduct}
        selectedMood={selectedMood}
        onClose={() => setSelectedProduct(null)}
        onViewOrders={() => { setShowOrders(true); setShowRanking(false); }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

type HomeScreenProps = {
  data: (typeof design.screens)[0]["components"];
  interactions: typeof design.interactions;
  onNavigate: (screen: ScreenId) => void;
  onShowOrders: () => void;
  onSelectProduct: (product: Product) => void;
  selectedMood: string | null;
  onSelectMood: (mood: string) => void;
};

function HomeScreen({
  data,
  interactions,
  onNavigate,
  onShowOrders,
  onSelectProduct,
  selectedMood,
  onSelectMood,
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<string>(data.tabs[0].id);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    api.products.getAll(selectedMood || undefined)
      .then(setApiProducts)
      .catch(console.error);
  }, [selectedMood]);

  // Apply mood-reactive theme
  useMoodTheme(selectedMood);

  // Products from API (with fallback)
  const productsToShow = useMemo(() => {
    if (apiProducts.length > 0) return apiProducts;
    // Fallback if API hasn't returned yet
    return data.products.items.map((m: any) => ({
      id: parseInt(m.id) || 0,
      name: m.name,
      price: parseFloat(m.price.replace('$', '')),
      mood_tag: selectedMood || '',
      description: m.description,
      image_url: m.image,
      flavor_profile: '',
      badge: m.badge
    }));
  }, [apiProducts, selectedMood, data.products.items]);

  // Filter desserts based on mood
  const filteredDesserts = useMemo(() => {
    if (!selectedMood) return data.desserts.items;
    const filtered = data.desserts.items.filter(
      (item: { tags?: readonly string[] }) =>
        !item.tags || item.tags.includes(selectedMood),
    );
    return filtered.length >= 2 ? filtered : data.desserts.items.slice(0, 2);
  }, [selectedMood, data.desserts.items]);

  // Get dynamic greeting based on time of day
  const greeting = getTimeBasedGreeting();
  const userName = profile?.name || "Guest";
  const greetingText = `${greeting}, ${userName}!`;

  return (
    <div className="relative">
      {/* Floating Particles Background - Optimized */}
      <FloatingParticles mood={selectedMood || "default"} count={10} />

      {/* 🎨 MODULAR MAGAZINE-STYLE LAYOUT */}

      {/* HERO SECTION - Full Width Impressive */}
      <motion.section
        className="relative z-10 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-12 shadow-elevated">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Greeting & CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-block px-4 py-2 rounded-pill bg-primary/10 mb-4">
                <span className="text-body-sm font-semibold text-primary">
                  ✨ Welcome to MoodBrew
                </span>
              </div>
              <h2 className="text-6xl font-black mb-4 gradient-text-animated font-playfair">
                {greetingText}
              </h2>
              <p className="text-2xl text-text-secondary mb-6 leading-relaxed">
                Your mood is our specialty ☕
              </p>
              <div className="flex gap-4">
                <Button className="px-8 py-4 text-lg">
                  🎁 Redeem Points: {data.header.points}
                </Button>
              </div>
            </motion.div>

            {/* Right: Avatar & Coffee Pour */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CoffeePourHero />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* BENTO GRID SECTION - Asymmetric Modular Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Daily Challenge - Takes 1 column */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DailyChallenge />
        </motion.div>

        {/* My Orders Preview - Takes 2 columns */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MyOrdersPreview onViewAll={onShowOrders} />
        </motion.div>
      </div>

      {/* MOOD SELECTOR - Circular Layout */}
      <motion.div
        className="relative z-10 mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* MOOD SELECTOR SECTION - Circular Pills Layout */}
        <Card glass glowOnHover className="relative z-10 crystal-effect">
          <div className="flex flex-col gap-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <motion.div className="text-4xl">😊</motion.div>
                <h3 className="text-3xl font-bold gradient-text">
                  {data.moodSelector.title}
                </h3>
              </div>
              <Badge variant="neutral">
                {interactions.moodSelection.action.replace(/_/g, " ")}
              </Badge>
            </div>

            {/* Circular Mood Pills */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {data.moodSelector.options.map((option) => {
                const isActive = option.id === selectedMood;
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => onSelectMood(option.id)}
                    className={`
                    relative flex flex-col items-center gap-2 rounded-full px-8 py-6
                    transition overflow-hidden min-w-[140px]
                    ${isActive
                        ? "bg-gradient-to-br from-primary to-secondary text-white shadow-elevated"
                        : "neumorphism text-text-primary hover:lift-3d"
                      }
                  `}
                  >
                    {isActive && (
                      <motion.div className="absolute inset-0 bg-primary/5 rounded-lg" />
                    )}
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-semibold">{option.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Live Recommendation Count + Scroll Button */}
            {selectedMood && (
              <motion.div
                key={selectedMood}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between mt-2 px-2"
              >
                <p className="text-body-sm text-text-secondary">
                  <span className="font-bold text-primary">{productsToShow.length}</span> drinks &{" "}
                  <span className="font-bold text-primary">{filteredDesserts.length}</span> treats matched for{" "}
                  <span className="font-semibold capitalize">{selectedMood}</span> mood
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    document.getElementById("recommendations-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-sm py-1 px-3"
                >
                  See recommendations ↓
                </Button>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>


      {/* SPLIT GRID - Weather & Tips Side by Side */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 items-stretch">
        <motion.div
          className="h-full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WeatherRecommendations />
        </motion.div>

        <motion.div
          className="h-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BaristaTips />
        </motion.div>
      </div>

      {/* ASYMMETRIC GRID - Feature + Fulfillment */}
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr,2fr] mb-12">
        {/* Feature Card - Elevated with Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden p-0 lift-3d shadow-elevated">
            <div className="relative h-64 w-full overflow-hidden">
              <motion.div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${data.featureCard.image})` }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <motion.div
                className="absolute top-4 right-4 px-4 py-2 rounded-pill bg-white/90 backdrop-blur"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-body-sm font-bold text-primary uppercase tracking-wide">
                  {data.featureCard.title}
                </span>
              </motion.div>
            </div>
            <div className="flex flex-col gap-sm p-lg crystal-effect">
              <h3 className="text-3xl font-bold gradient-text">
                {data.featureCard.subtitle}
              </h3>
              <Button
                onClick={() => onNavigate("product_detail")}
                className="self-start pulse-glow mt-4"
              >
                {data.featureCard.cta.text} →
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Fulfillment Card - Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="crystal-effect h-full">
            <div className="flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 text-text-primary">Fulfillment</h3>
                <span className="text-body-sm text-text-secondary">
                  {interactions.productTap.action.replace(/_/g, " ")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-sm">
                {data.tabs.map((tab) => {
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-sm rounded-lg border px-md py-3 text-body-md font-semibold transition ${isActive
                        ? "border-primary bg-primary text-surface"
                        : "border-background bg-background text-text-primary hover:border-primary/30"
                        }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Enhanced content based on selected tab */}
              <div className="mt-2 rounded-lg bg-background p-md">
                {activeTab === "pick_up" ? (
                  <div className="flex flex-col gap-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-sm">
                        <span className="text-2xl">⏱️</span>
                        <div>
                          <p className="text-body-sm text-text-secondary">
                            Estimated Wait Time
                          </p>
                          <p className="text-body-lg font-semibold text-text-primary">
                            15-20 minutes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-body-sm text-text-secondary">
                          Nearest Store
                        </p>
                        <p className="text-body-md font-semibold text-primary">
                          0.8 km away
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-primary/5 px-sm py-2">
                      <span className="text-body-sm">💡</span>
                      <p className="text-body-sm text-text-secondary">
                        <span className="font-semibold text-primary">
                          Save 10%
                        </span>{" "}
                        when you pick up in-store
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-sm">
                        <span className="text-2xl">🚚</span>
                        <div>
                          <p className="text-body-sm text-text-secondary">
                            Delivery Time
                          </p>
                          <p className="text-body-lg font-semibold text-text-primary">
                            30-45 minutes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-body-sm text-text-secondary">
                          Delivery Fee
                        </p>
                        <p className="text-body-md font-semibold text-primary">
                          $2.99
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-primary/5 px-sm py-2">
                      <span className="text-body-sm">🎁</span>
                      <p className="text-body-sm text-text-secondary">
                        <span className="font-semibold text-primary">
                          Free delivery
                        </span>{" "}
                        on orders over $25
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Store Hours */}
              <div className="flex items-center gap-sm rounded-lg border border-background p-sm">
                <span className="text-body-md">🕐</span>
                <div className="flex-1">
                  <p className="text-body-sm font-semibold text-text-primary">
                    Store Hours
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    Mon - Sun: 7:00 AM - 10:00 PM
                  </p>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-body-xs text-text-secondary">
                  Open Now
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* PRODUCTS SECTION - Masonry Grid */}
      <motion.div
        id="recommendations-section"
        className="relative z-10 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card glass glowOnHover className="crystal-effect">
          <div className="flex flex-col gap-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">☕</div>
                <h3 className="text-3xl font-bold gradient-text">
                  {selectedMood
                    ? `Recommended for ${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}`
                    : data.products.title}
                </h3>
              </div>
              <Badge variant="calorie">
                {selectedMood ? "Mood Matched" : "Auto-refresh with moods"}
              </Badge>
            </div>

            {/* Grid with Different Column Spans */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMood ?? "all"}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {productsToShow.map((product) => {
                  const badge = "badge" in product ? product.badge : undefined;
                  const badgeVariant =
                    badge === "BEST DEAL"
                      ? "discount"
                      : badge
                        ? "calorie"
                        : "neutral";
                  return (
                    <div
                      key={product.id}
                      className="group cursor-pointer"
                    >
                      <Card className="overflow-hidden p-0 h-full lift-3d neumorphism">
                        {/* Image Section */}
                        <div className="relative h-48 overflow-hidden">
                          <motion.img
                            src={product.image_url || (product as any).image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            whileHover={{ scale: 1.15 }}
                            transition={{ duration: 0.6 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Badge Overlay */}
                          {badge && (
                            <div className="absolute top-3 right-3">
                              <Badge
                                variant={badgeVariant}
                                className="pulse-glow"
                              >
                                {badge}
                              </Badge>
                            </div>
                          )}

                          {/* Price Badge */}
                          <div className="absolute bottom-3 left-3 px-4 py-2 rounded-full bg-white/90 backdrop-blur">
                            <span className="text-lg font-black gradient-text">
                              ${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 bg-gradient-to-br from-white to-surface">
                          <h4 className="text-lg font-bold text-text-primary mb-3">
                            {product.name}
                          </h4>
                          <Button
                            onClick={() => onSelectProduct(product)}
                            className="w-full"
                            variant="secondary"
                          >
                            Quick Order →
                          </Button>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>

      {/* DESSERTS SECTION */}
      <Card glass glowOnHover className="relative z-10">
        <div className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <motion.span className="text-2xl">🍰</motion.span>
                <h3 className="text-h3 text-text-primary">
                  {selectedMood
                    ? `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Pairings`
                    : data.desserts.title}
                </h3>
              </div>
              <span className="text-body-sm text-text-secondary">
                Swipe to explore
              </span>
            </div>
            <p className="text-body-sm text-text-secondary italic">
              {data.desserts.subtitle}
            </p>
          </div>
          <motion.div
            className="flex gap-md overflow-x-auto pb-sm custom-scrollbar"
            key={selectedMood}
          >
            {filteredDesserts.map((item, index) => {
              const badge = "badge" in item ? item.badge : undefined;
              const badgeVariant =
                badge === "BESTSELLER"
                  ? "discount"
                  : badge === "NEW"
                    ? "calorie"
                    : "neutral";
              return (
                <motion.div
                  key={item.id}
                  className="group relative w-56 flex-shrink-0 cursor-pointer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                  }}
                >
                  <motion.div className="relative overflow-hidden rounded-xl border border-background bg-surface shadow-md transition-all hover:border-primary/50 hover:shadow-lg">
                    <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.4 }}
                      />
                      {badge && (
                        <motion.div
                          className="absolute top-2 right-2"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: index * 0.1 + 0.2,
                            type: "spring",
                          }}
                        >
                          <Badge variant={badgeVariant} pulse={badge === "NEW"}>
                            {badge}
                          </Badge>
                        </motion.div>
                      )}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />
                    </div>
                    <div className="p-md">
                      <h4 className="text-body-lg font-semibold text-text-primary mb-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-body-md font-semibold text-primary">
                          {item.price}
                        </p>
                        <motion.button
                          className="rounded-full bg-primary p-2 text-surface hover:bg-primary/90"
                          initial={{ opacity: 0, scale: 0 }}
                          whileHover={{ opacity: 1, scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="text-body-sm">+</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Card>

      {/* FEATURE SPOTLIGHT - Side by Side */}
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        {/* Interactive Flavor Wheel - Takes left half */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FlavorWheel />
        </motion.div>

        {/* Live Stats Dashboard - Takes right half */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LiveStats />
        </motion.div>
      </div>

      <nav className="relative z-10 flex items-center justify-around rounded-lg bg-surface p-md shadow-sm">
        {data.navigation.map((item) => (
          <button
            key={item.id}
            className={`flex flex-col items-center gap-xs text-body-sm ${item.id === "home" ? "text-primary" : "text-text-secondary"
              }`}
            onClick={() => {
              if (item.id === "home") return;
              if (item.id === "orders") {
                onShowOrders();
                return;
              }
              onNavigate("weekly_ranking");
            }}
          >
            <span className="text-2xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

type ProductDetailProps = {
  data: (typeof design.screens)[1]["components"];
  onBack: () => void;
};

function ProductDetailScreen({ data, onBack }: ProductDetailProps) {
  const content = data.product;
  const [selectedCafe, setSelectedCafe] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Mock data for multi-cafe availability (in production, fetch from API)
  const cafeAvailability = [
    {
      cafeName: "Cafe Camilia",
      address: "Lakeside, Pokhara, Nepal",
      distance: "0.8 km",
      rating: 4.9,
      reviews: 234,
      price: "$10",
      prepTime: "5-7 min",
      available: true,
      popular: true,
    },
    {
      cafeName: "Himalayan Java",
      address: "Lakeside Road, Pokhara",
      distance: "1.2 km",
      rating: 4.8,
      reviews: 189,
      price: "$9.50",
      prepTime: "6-8 min",
      available: true,
      popular: false,
    },
    {
      cafeName: "White Rabbit",
      address: "Baidam Road, Pokhara",
      distance: "0.5 km",
      rating: 4.7,
      reviews: 156,
      price: "$11",
      prepTime: "4-6 min",
      available: false,
      popular: false,
    },
    {
      cafeName: "Coffee Culture",
      address: "Center Point, Pokhara",
      distance: "2.1 km",
      rating: 4.6,
      reviews: 98,
      price: "$9",
      prepTime: "7-10 min",
      available: true,
      popular: false,
    },
  ];

  // Nutritional information
  const nutritionInfo = [
    { label: "Calories", value: "245", unit: "kcal", percentage: 12 },
    { label: "Protein", value: "8", unit: "g", percentage: 16 },
    { label: "Carbs", value: "32", unit: "g", percentage: 11 },
    { label: "Fat", value: "9", unit: "g", percentage: 14 },
    { label: "Sugar", value: "24", unit: "g", percentage: 27 },
    { label: "Caffeine", value: "150", unit: "mg", percentage: 50 },
  ];

  // Customer insights
  const popularCustomizations = [
    { name: "Extra Shot", percentage: 68, icon: "☕" },
    { name: "Almond Milk", percentage: 52, icon: "🥛" },
    { name: "Whipped Cream", percentage: 45, icon: "🍦" },
    { name: "Caramel Drizzle", percentage: 38, icon: "🍯" },
  ];

  // Rating breakdown
  const ratingBreakdown = [
    { stars: 5, count: 189, percentage: 81 },
    { stars: 4, count: 32, percentage: 14 },
    { stars: 3, count: 8, percentage: 3 },
    { stars: 2, count: 3, percentage: 1 },
    { stars: 1, count: 2, percentage: 1 },
  ];

  // Similar products
  const similarProducts = [
    {
      name: "Vanilla Latte",
      price: "$9",
      image: content.images[0],
      rating: 4.7,
    },
    {
      name: "Mocha Frappuccino",
      price: "$11",
      image: content.images[1],
      rating: 4.8,
    },
    { name: "Cappuccino", price: "$8", image: content.images[0], rating: 4.6 },
  ];

  const images = [content.images[0], content.images[1], content.images[0]]; // Gallery

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER WITH BACK BUTTON */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button variant="outline" onClick={onBack} className="px-md">
          ← Back
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="calorie" className="pulse-glow">
            {content.calorieBadge}
          </Badge>
          <button
            className="text-2xl hover:scale-110 transition"
            aria-label="Bookmark product"
          >
            🔖
          </button>
          <button
            className="text-2xl hover:scale-110 transition"
            aria-label="Share product"
          >
            📤
          </button>
        </div>
      </motion.div>

      {/* HERO SECTION - Large Image + Quick Info */}
      <motion.div
        className="grid lg:grid-cols-[2fr,1fr] gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* LEFT COLUMN - IMAGE GALLERY + THUMBNAILS + FEATURES */}
        <div className="flex flex-col gap-4">
          {/* MAIN IMAGE */}
          <Card className="p-0 overflow-hidden lift-3d">
            <div className="relative h-96">
              <motion.img
                key={activeImageIndex}
                src={images[activeImageIndex]}
                alt={content.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Image Navigation */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`w-2 h-2 rounded-full transition ${index === activeImageIndex
                      ? "bg-white w-8"
                      : "bg-white/50"
                      }`}
                  />
                ))}
              </div>

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="discount" className="pulse-glow">
                  ⭐ 4.9 Rating
                </Badge>
                <Badge variant="neutral" className="crystal-effect">
                  📸 {images.length} Photos
                </Badge>
              </div>
            </div>
          </Card>

          {/* IMAGE THUMBNAILS */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`
                  relative h-24 rounded-xl overflow-hidden cursor-pointer transition-all
                  ${index === activeImageIndex
                    ? "ring-4 ring-primary shadow-elevated"
                    : "ring-2 ring-transparent hover:ring-primary/50"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={image}
                  alt={`${content.title} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === activeImageIndex && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* QUICK FEATURE BADGES */}
          <Card className="crystal-effect p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="text-sm font-bold text-green-700">
                    Freshly Made
                  </div>
                  <div className="text-xs text-text-secondary">On Order</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                <div className="text-2xl">🥛</div>
                <div>
                  <div className="text-sm font-bold text-blue-700">
                    Dairy Options
                  </div>
                  <div className="text-xs text-text-secondary">5 Choices</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                <div className="text-2xl">🎨</div>
                <div>
                  <div className="text-sm font-bold text-purple-700">
                    Customizable
                  </div>
                  <div className="text-xs text-text-secondary">Your Way</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                <div className="text-2xl">🔥</div>
                <div>
                  <div className="text-sm font-bold text-amber-700">
                    Bestseller
                  </div>
                  <div className="text-xs text-text-secondary">Top 5</div>
                </div>
              </div>
            </div>
          </Card>

          {/* CUSTOMER PHOTOS PREVIEW */}
          <Card className="crystal-effect p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-text-primary flex items-center gap-2">
                📸 Customer Photos
              </h4>
              <button className="text-sm text-primary font-semibold hover:underline">
                View All (124)
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition"
                >
                  <img
                    src={images[i % images.length]}
                    alt={`Customer photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* QUICK STATS */}
        <Card className="crystal-effect h-full">
          <div className="flex flex-col gap-6 h-full">
            <div>
              <h1 className="text-4xl font-black gradient-text mb-2">
                {content.title}
              </h1>
              <p className="text-lg text-text-secondary">
                {content.description}
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="neumorphism rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">⭐</div>
                <div className="text-2xl font-bold gradient-text">4.9</div>
                <div className="text-sm text-text-secondary">234 Reviews</div>
              </div>
              <div className="neumorphism rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-2xl font-bold gradient-text">2.3k</div>
                <div className="text-sm text-text-secondary">Orders</div>
              </div>
              <div className="neumorphism rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">⏱️</div>
                <div className="text-2xl font-bold gradient-text">5-7</div>
                <div className="text-sm text-text-secondary">Minutes</div>
              </div>
              <div className="neumorphism rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">💰</div>
                <div className="text-2xl font-bold gradient-text">$9-11</div>
                <div className="text-sm text-text-secondary">Price Range</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-auto flex flex-col gap-3">
              <Button className="w-full pulse-glow text-lg py-4">
                🛒 Add to Cart - $10
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full">
                  💬 Reviews
                </Button>
                <Button variant="outline" className="w-full">
                  📍 Map
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* PRODUCT HIGHLIGHTS - Full Width Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="crystal-effect overflow-hidden">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* What Makes It Special */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold gradient-text mb-3 flex items-center gap-2">
                ✨ What Makes It Special
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <h4 className="font-bold text-text-primary">
                      Premium Ingredients
                    </h4>
                    <p className="text-sm text-text-secondary">
                      100% Authentic French Vanilla Syrup & Fresh Espresso
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition">
                  <span className="text-2xl">👨‍🍳</span>
                  <div>
                    <h4 className="font-bold text-text-primary">
                      Expert Crafted
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Hand-crafted by certified baristas with 5+ years
                      experience
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <h4 className="font-bold text-text-primary">
                      Award Winner
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Best Specialty Drink 2023 - Pokhara Coffee Awards
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Facts */}
            <div>
              <h3 className="text-xl font-bold gradient-text mb-3 flex items-center gap-2">
                📋 Quick Facts
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg neumorphism">
                  <span className="text-sm font-semibold text-text-secondary">
                    Serving Size
                  </span>
                  <span className="text-lg font-bold text-text-primary">
                    16 oz
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg neumorphism">
                  <span className="text-sm font-semibold text-text-secondary">
                    Temperature
                  </span>
                  <span className="text-lg font-bold text-text-primary">
                    Hot/Iced
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg neumorphism">
                  <span className="text-sm font-semibold text-text-secondary">
                    Dairy
                  </span>
                  <span className="text-lg font-bold text-text-primary">
                    Yes ✓
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg neumorphism">
                  <span className="text-sm font-semibold text-text-secondary">
                    Sweetness
                  </span>
                  <span className="text-lg font-bold text-text-primary">
                    Medium
                  </span>
                </div>
              </div>
            </div>

            {/* Perfect For */}
            <div>
              <h3 className="text-xl font-bold gradient-text mb-3 flex items-center gap-2">
                🎯 Perfect For
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">☀️</span>
                    <span className="font-bold text-text-primary">
                      Morning Boost
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Strong caffeine kick to start your day
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🍰</span>
                    <span className="font-bold text-text-primary">
                      Dessert Pairing
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Pairs perfectly with pastries & cakes
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">❄️</span>
                    <span className="font-bold text-text-primary">
                      Afternoon Treat
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Refreshing iced version for warm days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar - Quick Stats */}
          <div className="mt-6 pt-6 border-t border-background grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-lg font-black gradient-text">2.3k</div>
              <div className="text-xs text-text-secondary">
                Orders This Month
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">⚡</div>
              <div className="text-lg font-black gradient-text">5-7</div>
              <div className="text-xs text-text-secondary">Prep Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">💚</div>
              <div className="text-lg font-black gradient-text">98%</div>
              <div className="text-xs text-text-secondary">Love This</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">🎁</div>
              <div className="text-lg font-black gradient-text">+50</div>
              <div className="text-xs text-text-secondary">Loyalty Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">📱</div>
              <div className="text-lg font-black gradient-text">Free</div>
              <div className="text-xs text-text-secondary">Delivery $25+</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* MULTI-CAFE AVAILABILITY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="crystal-effect">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-1">
                🏪 Available at {cafeAvailability.length} Cafes
              </h3>
              <p className="text-text-secondary">
                Compare prices and choose your preferred location
              </p>
            </div>
            <Badge variant="discount" className="pulse-glow">
              💰 Best Price Guaranteed
            </Badge>
          </div>

          <div className="grid gap-4">
            {cafeAvailability.map((cafe, index) => (
              <motion.div
                key={index}
                className={`
                  relative rounded-xl border-2 p-5 cursor-pointer transition-all
                  ${selectedCafe === index
                    ? "border-primary bg-primary/5 shadow-elevated"
                    : "border-transparent bg-background hover:border-primary/30"
                  }
                  ${!cafe.available ? "opacity-50" : ""}
                `}
                onClick={() => cafe.available && setSelectedCafe(index)}
                whileHover={{ scale: cafe.available ? 1.02 : 1 }}
                whileTap={{ scale: cafe.available ? 0.98 : 1 }}
              >
                {cafe.popular && (
                  <div className="absolute -top-3 left-4">
                    <Badge variant="discount" className="pulse-glow">
                      🔥 Most Popular
                    </Badge>
                  </div>
                )}

                <div className="grid lg:grid-cols-[1fr,auto,auto,auto,auto] gap-4 items-center">
                  {/* Cafe Info */}
                  <div>
                    <h4 className="text-lg font-bold text-text-primary mb-1">
                      {cafe.cafeName}
                    </h4>
                    <p className="text-sm text-text-secondary flex items-center gap-2">
                      📍 {cafe.address} • {cafe.distance}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">
                      ⭐ {cafe.rating}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {cafe.reviews} reviews
                    </div>
                  </div>

                  {/* Prep Time */}
                  <div className="text-center">
                    <div className="text-xl font-bold text-text-primary">
                      ⏱️ {cafe.prepTime}
                    </div>
                    <div className="text-xs text-text-secondary">Prep time</div>
                  </div>

                  {/* Price */}
                  <div className="text-center">
                    <div className="text-2xl font-black gradient-text">
                      {cafe.price}
                    </div>
                    <div className="text-xs text-text-secondary">Price</div>
                  </div>

                  {/* Action */}
                  <div>
                    {cafe.available ? (
                      <Button
                        className={selectedCafe === index ? "pulse-glow" : ""}
                        variant={
                          selectedCafe === index ? "primary" : "secondary"
                        }
                      >
                        {selectedCafe === index ? "✓ Selected" : "Select"}
                      </Button>
                    ) : (
                      <Badge variant="neutral">Closed</Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* DETAILED INFO TABS - Nutrition, Ingredients, Reviews */}
      <motion.div
        className="grid lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* NUTRITIONAL INFORMATION */}
        <Card className="crystal-effect">
          <h3 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2">
            🥗 Nutritional Information
          </h3>
          <div className="space-y-4">
            {nutritionInfo.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-primary font-semibold">
                    {item.label}
                  </span>
                  <span className="text-lg font-bold">
                    {item.value}
                    {item.unit}
                    <span className="text-sm text-text-secondary ml-2">
                      ({item.percentage}% DV)
                    </span>
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <h4 className="font-bold text-text-primary mb-2">📋 Ingredients</h4>
            <p className="text-sm text-text-secondary">
              Espresso, Steamed Milk, Vanilla Syrup, Caramel Sauce, Whipped
              Cream, Caramel Drizzle
            </p>
            <h4 className="font-bold text-text-primary mb-2 mt-3">
              ⚠️ Allergens
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="calorie">🥛 Dairy</Badge>
              <Badge variant="neutral">🌾 Gluten-Free</Badge>
              <Badge variant="neutral">🥜 Nut-Free</Badge>
            </div>
          </div>
        </Card>

        {/* CUSTOMER INSIGHTS */}
        <Card className="crystal-effect">
          <h3 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2">
            📊 Customer Insights
          </h3>

          {/* Rating Breakdown */}
          <div className="mb-6">
            <h4 className="font-bold text-text-primary mb-3">
              ⭐ Rating Breakdown
            </h4>
            <div className="space-y-2">
              {ratingBreakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-semibold w-12">
                    {item.stars} ★
                  </span>
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-sm text-text-secondary w-16">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Customizations */}
          <div>
            <h4 className="font-bold text-text-primary mb-3">
              🎨 Popular Customizations
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {popularCustomizations.map((custom, index) => (
                <div
                  key={index}
                  className="neumorphism rounded-xl p-4 text-center"
                >
                  <div className="text-3xl mb-1">{custom.icon}</div>
                  <div className="font-bold text-text-primary">
                    {custom.name}
                  </div>
                  <div className="text-2xl font-black gradient-text">
                    {custom.percentage}%
                  </div>
                  <div className="text-xs text-text-secondary">of orders</div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Time to Order */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <h4 className="font-bold text-text-primary mb-2">
              ⏰ Best Time to Order
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-text-secondary">Least Busy</div>
                <div className="font-bold text-green-600">
                  2:00 PM - 4:00 PM
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-text-secondary">Most Popular</div>
                <div className="font-bold text-orange-600">
                  8:00 AM - 10:00 AM
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* CUSTOMIZATION OPTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="crystal-effect">
          <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
            🎛️ Customize Your Order
          </h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {content.options.map((option, index) => (
              <div key={index} className="neumorphism rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">
                      {option.title}
                    </h4>
                    {option.required ? (
                      <Badge variant="discount" className="mt-1">
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="neutral" className="mt-1">
                        Optional
                      </Badge>
                    )}
                  </div>
                  <span className="text-2xl">
                    {option.type === "radio" ? "🔘" : "☑️"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {option.choices.map((choice, choiceIndex) => {
                    const isSelected =
                      "selected" in choice ? choice.selected : false;
                    return (
                      <label
                        key={choiceIndex}
                        className={`
                          flex items-center gap-2 rounded-pill px-5 py-3 cursor-pointer transition-all
                          ${isSelected
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-elevated"
                            : "bg-background border-2 border-background hover:border-primary/30"
                          }
                        `}
                      >
                        <input
                          type={option.type}
                          name={option.title}
                          defaultChecked={Boolean(isSelected)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span className="font-semibold">{choice.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* SIMILAR PRODUCTS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="crystal-effect">
          <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
            ✨ You Might Also Like
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {similarProducts.map((product, index) => (
              <motion.div
                key={index}
                className="neumorphism rounded-xl overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="discount" className="pulse-glow">
                      ⭐ {product.rating}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-text-primary mb-1">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black gradient-text">
                      {product.price}
                    </span>
                    <Button variant="secondary" className="px-4 py-2">
                      Add →
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* STICKY FOOTER - Cart Summary */}
      <motion.div
        className="sticky bottom-4 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="crystal-effect shadow-elevated">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img
                src={images[0]}
                alt={content.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-text-primary">{content.title}</h4>
                <p className="text-sm text-text-secondary">
                  {cafeAvailability[selectedCafe].cafeName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">Total</div>
                <div className="text-3xl font-black gradient-text">
                  {cafeAvailability[selectedCafe].price}
                </div>
              </div>
              <Button className="px-8 py-4 text-lg pulse-glow">
                🛒 Add to Cart
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

type WeeklyRankingProps = {
  data: (typeof design.screens)[2]["components"];
  interactions: typeof design.interactions;
  onNavigate: (screen: ScreenId) => void;
};

function WeeklyRankingScreen({
  data,
  interactions,
  onNavigate,
}: WeeklyRankingProps) {
  // AI Ranking feature removed due to pending implementation
  // const [activeFilter, setActiveFilter] = useState<string>(
  //   data.ranking.filters[0].id,
  // );
  const [activeFilter, setActiveFilter] = useState<string>(
    data.ranking.filters[0].id,
  );

  // const [aiRanking, setAiRanking] = useState<CafeRanking | null>(null);
  // const [isLoadingRanking, setIsLoadingRanking] = useState(false);

  // useEffect removed

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => onNavigate("home")}
          className="px-md"
        >
          ← Home
        </Button>
        <div className="text-body-sm text-text-secondary">
          {interactions.filterChange?.action?.replace(/_/g, " ") ??
            "Filter results"}
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-md">
          <div>
            <h2 className="text-h2 text-text-primary">
              {data.ranking.header.title}
            </h2>
            <p className="text-body-md text-text-secondary">
              {data.ranking.header.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-sm">
            {data.ranking.filters.map((filter) => {
              const isActive = filter.id === activeFilter;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-pill px-md py-2 text-body-sm font-semibold transition ${isActive
                    ? "bg-primary text-surface"
                    : "bg-background text-text-secondary"
                    }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Olympic-Style Podium Leaderboard */}
      <Card
        glass
        glowOnHover
        className="overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
      >
        <div className="flex flex-col gap-lg p-lg">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-sm mb-2">
              <motion.span
                className="text-3xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🏆
              </motion.span>
              <h3 className="text-h2 text-text-primary">Top 3 Champions</h3>
              <motion.span
                className="text-3xl"
                animate={{
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                🏆
              </motion.span>
            </div>
            <p className="text-body-sm text-text-secondary">
              The best cafes in Pokhara this week
            </p>
          </motion.div>

          {/* Podium */}
          <div className="relative flex items-end justify-center gap-2 sm:gap-4 lg:gap-6 min-h-[400px] pb-4">
            {/* 2nd Place (Left) */}
            {data.ranking.list[1] && (
              <div className="flex flex-col items-center justify-end flex-1 max-w-[200px] relative z-10">
                {/* Text Content - Above Podium */}
                <motion.div
                  className="flex flex-col items-center gap-2 mb-3 relative z-20"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <motion.div
                    className="text-5xl"
                    variants={medalSpinVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.6 }}
                  >
                    🥈
                  </motion.div>
                  <div className="text-center glass rounded-lg px-3 py-2 shadow-sm">
                    <h4 className="text-body-md font-bold text-text-primary">
                      {data.ranking.list[1].cafeName}
                    </h4>
                    <p className="text-body-xs text-text-secondary mt-1">
                      ⭐ {data.ranking.list[1].rating.toFixed(1)}
                    </p>
                  </div>
                </motion.div>
                {/* Podium Bar */}
                <motion.div
                  className="relative w-full bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg shadow-lg cursor-pointer hover:shadow-xl transition-all"
                  initial={{ height: 0 }}
                  animate={{ height: "160px" }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => onNavigate("cafe_detail")}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-400/50 to-transparent rounded-t-lg"></div>
                  <motion.div
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                  >
                    <div className="bg-surface rounded-full px-3 py-1 shadow-md border-2 border-gray-300">
                      <span className="text-body-xs font-bold text-text-primary">
                        #2
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            )}

            {/* 1st Place (Center - Highest) */}
            {data.ranking.list[0] && (
              <div className="flex flex-col items-center justify-end flex-1 max-w-[220px] relative z-20">
                {/* Text Content - Above Podium */}
                <motion.div
                  className="flex flex-col items-center gap-2 mb-3 relative z-20"
                  initial={{ opacity: 0, y: -40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <motion.div
                    className="text-6xl"
                    variants={medalSpinVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.3 }}
                  >
                    🥇
                  </motion.div>
                  <div className="text-center glass rounded-lg px-3 py-2 shadow-sm">
                    <h4 className="text-body-lg font-bold text-text-primary">
                      {data.ranking.list[0].cafeName}
                    </h4>
                    <p className="text-body-sm text-text-secondary mt-1">
                      ⭐ {data.ranking.list[0].rating.toFixed(1)}
                    </p>
                    <Badge
                      variant="discount"
                      className="mt-1 text-body-xs"
                      pulse
                    >
                      Champion
                    </Badge>
                  </div>
                </motion.div>
                {/* Podium Bar with Shimmer */}
                {/* Podium Bar with Shimmer */}
                <motion.div
                  className="relative w-full rounded-t-lg shadow-2xl cursor-pointer transition-all"
                  initial={{ height: 0 }}
                  animate={{ height: "200px" }}
                  transition={{
                    delay: 0.1,
                    duration: 0.8,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => onNavigate("cafe_detail")}
                >
                  {/* Inner Container for Background & Shimmer (Clipped) */}
                  <div className="absolute inset-0 rounded-t-lg overflow-hidden bg-gradient-to-t from-yellow-400 via-yellow-300 to-yellow-200">
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 to-transparent rounded-t-lg"></div>
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>

                  {/* Badge (Outside Clipping) */}
                  <motion.div
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <div className="bg-surface rounded-full px-3 py-1 shadow-md border-2 border-yellow-400">
                      <span className="text-body-xs font-bold text-text-primary">
                        #1
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            )}

            {/* 3rd Place (Right) */}
            {data.ranking.list[2] && (
              <div className="flex flex-col items-center justify-end flex-1 max-w-[200px] relative z-10">
                {/* Text Content - Above Podium */}
                <motion.div
                  className="flex flex-col items-center gap-2 mb-3 relative z-20"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <motion.div
                    className="text-5xl"
                    variants={medalSpinVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.8 }}
                  >
                    🥉
                  </motion.div>
                  <div className="text-center glass rounded-lg px-3 py-2 shadow-sm">
                    <h4 className="text-body-md font-bold text-text-primary">
                      {data.ranking.list[2].cafeName}
                    </h4>
                    <p className="text-body-xs text-text-secondary mt-1">
                      ⭐ {data.ranking.list[2].rating.toFixed(1)}
                    </p>
                  </div>
                </motion.div>
                {/* Podium Bar */}
                <motion.div
                  className="relative w-full bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg shadow-lg cursor-pointer hover:shadow-xl transition-all"
                  initial={{ height: 0 }}
                  animate={{ height: "120px" }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => onNavigate("cafe_detail")}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-700/50 to-transparent rounded-t-lg"></div>
                  <motion.div
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                  >
                    <div className="bg-surface rounded-full px-3 py-1 shadow-md border-2 border-amber-600">
                      <span className="text-body-xs font-bold text-text-primary">
                        #3
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Stats & Insights */}
      {(() => {
        const nearestCafe = data.ranking.list.reduce((nearest, cafe) => {
          const nearestDist = parseFloat(nearest.distance.replace("km", ""));
          const currentDist = parseFloat(cafe.distance.replace("km", ""));
          return currentDist < nearestDist ? cafe : nearest;
        }, data.ranking.list[0]);

        const bestValue = data.ranking.list.reduce((best, cafe) => {
          const bestPrice = parseFloat(
            best.price.match(/Rs\s*(\d+)/)?.[1] || "999",
          );
          const currentPrice = parseFloat(
            cafe.price.match(/Rs\s*(\d+)/)?.[1] || "999",
          );
          return currentPrice < bestPrice ? cafe : best;
        }, data.ranking.list[0]);

        const topRated = data.ranking.list.reduce(
          (top, cafe) => (cafe.rating > top.rating ? cafe : top),
          data.ranking.list[0],
        );

        const totalCafes =
          data.ranking.list.length +
          (data.ranking.hiddenGems?.items.length || 0);

        return (
          <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-4">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate("cafe_detail")}
            >
              <div className="flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <span className="text-2xl">📍</span>
                  <h4 className="text-body-md font-semibold text-text-primary">
                    Nearest Cafe
                  </h4>
                </div>
                <p className="text-body-lg font-bold text-primary">
                  {nearestCafe.cafeName}
                </p>
                <p className="text-body-sm text-text-secondary">
                  {nearestCafe.distance} away
                </p>
              </div>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate("cafe_detail")}
            >
              <div className="flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <span className="text-2xl">💰</span>
                  <h4 className="text-body-md font-semibold text-text-primary">
                    Best Value
                  </h4>
                </div>
                <p className="text-body-lg font-bold text-primary">
                  {bestValue.cafeName}
                </p>
                <p className="text-body-sm text-text-secondary">
                  Starting from {bestValue.price.split(" - ")[0]}
                </p>
              </div>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate("cafe_detail")}
            >
              <div className="flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <span className="text-2xl">⭐</span>
                  <h4 className="text-body-md font-semibold text-text-primary">
                    Top Rated
                  </h4>
                </div>
                <p className="text-body-lg font-bold text-primary">
                  {topRated.cafeName}
                </p>
                <p className="text-body-sm text-text-secondary">
                  ⭐ {topRated.rating.toFixed(1)} rating
                </p>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <span className="text-2xl">🔥</span>
                  <h4 className="text-body-md font-semibold text-text-primary">
                    Total Cafes
                  </h4>
                </div>
                <p className="text-body-lg font-bold text-primary">
                  {totalCafes}
                </p>
                <p className="text-body-sm text-text-secondary">
                  {data.ranking.list.length} top rated +{" "}
                  {data.ranking.hiddenGems?.items.length || 0} hidden gems
                </p>
              </div>
            </Card>
          </div>
        );
      })()}

      {/* Hidden Gems Section */}
      {data.ranking.hiddenGems && (
        <Card>
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-sm">
                <span className="text-2xl">💎</span>
                <h3 className="text-h3 text-text-primary">
                  {data.ranking.hiddenGems.title}
                </h3>
              </div>
              <p className="text-body-sm text-text-secondary italic">
                {data.ranking.hiddenGems.subtitle}
              </p>
            </div>
            <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-4">
              {data.ranking.hiddenGems.items.map((gem) => (
                <div
                  key={gem.id}
                  className="group cursor-pointer rounded-lg border border-background bg-background p-md transition-all hover:border-primary/50 hover:shadow-md"
                  onClick={() => onNavigate("cafe_detail")}
                >
                  <div className="mb-sm flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-body-lg font-semibold text-text-primary mb-1">
                        {gem.cafeName}
                      </h4>
                      <p className="text-body-xs text-text-secondary mb-2">
                        {gem.location}
                      </p>
                    </div>
                    <span className="text-body-sm font-semibold text-primary">
                      ⭐ {gem.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="mb-sm rounded-md bg-primary/5 p-sm">
                    <p className="text-body-xs text-text-secondary mb-1">
                      Popular Item
                    </p>
                    <p className="text-body-sm font-medium text-text-primary">
                      {gem.popularItem}
                    </p>
                  </div>
                  <p className="text-body-xs text-text-secondary mb-2 italic">
                    {gem.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm font-semibold text-primary">
                      {gem.price}
                    </span>
                    <span className="text-body-xs text-text-secondary">
                      {gem.distance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

type CafeDetailProps = {
  data: (typeof design.screens)[3]["components"];
  onBack: () => void;
};

function CafeDetailScreen({ data, onBack }: CafeDetailProps) {
  const content = data.cafe;

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="px-md">
          ← Rankings
        </Button>
        <div className="text-body-sm text-text-secondary">
          Enhanced with live map and amenity details
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Dynamic background image - must use inline style for runtime URL */}
        <div
          className="h-56 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${content.banner.image})` }}
        />
        <div className="flex flex-col gap-md p-lg">
          <div className="flex flex-col gap-xs">
            <h2 className="text-h2 text-text-primary">
              {content.banner.cafeName}
            </h2>
            <p className="text-body-md text-text-secondary">
              {content.banner.cuisine}
            </p>
            <div className="flex items-center gap-md text-body-md text-text-secondary">
              <span>⭐ {content.banner.rating.toFixed(1)}</span>
              <span>{content.banner.priceRange}</span>
              <span>{content.banner.location}</span>
            </div>
          </div>

          <div className="grid gap-sm sm:grid-cols-4">
            {content.features.map((feature) => (
              <div
                key={feature.label}
                className="flex flex-col items-center gap-xs rounded-lg bg-background p-md text-body-sm"
              >
                <span className="text-body-md font-semibold text-primary">
                  {feature.icon}
                </span>
                <span className="text-text-secondary">{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-lg lg:grid-cols-3">
            {/* Left Column: About & Menu */}
            <div className="lg:col-span-2 flex flex-col gap-lg">
              {/* About Section */}
              <div>
                <h3 className="text-h3 text-text-primary mb-sm">About</h3>
                <p className="text-body-md text-text-secondary leading-relaxed">
                  Experience the authentic taste of the Himalayas at Cafe
                  Camilia. We pride ourselves on sourcing the finest organic
                  beans from local farmers and roasting them to perfection. Our
                  cozy ambiance, complete with comfortable seating and soothing
                  music, makes it the perfect spot for work, relaxation, or
                  catching up with friends.
                </p>
              </div>

              {/* Menu Section */}
              <div>
                <h3 className="text-h3 text-text-primary mb-sm">
                  {content.menu.title}
                </h3>
                <div className="grid gap-sm sm:grid-cols-2">
                  {content.menu.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-md rounded-lg border border-background p-md hover:border-primary/30 transition-colors cursor-pointer group"
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-md bg-background">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <p className="text-body-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        <p className="text-body-sm text-text-secondary">
                          {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Additional Mock Menu Items */}
                  <div className="flex items-center gap-md rounded-lg border border-background p-md hover:border-primary/30 transition-colors cursor-pointer group">
                    <div className="h-16 w-16 overflow-hidden rounded-md bg-background">
                      <div className="h-full w-full bg-amber-100 flex items-center justify-center text-2xl">
                        🥐
                      </div>
                    </div>
                    <div>
                      <p className="text-body-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                        Butter Croissant
                      </p>
                      <p className="text-body-sm text-text-secondary">Rs 180</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-md rounded-lg border border-background p-md hover:border-primary/30 transition-colors cursor-pointer group">
                    <div className="h-16 w-16 overflow-hidden rounded-md bg-background">
                      <div className="h-full w-full bg-amber-900 flex items-center justify-center text-2xl">
                        🍰
                      </div>
                    </div>
                    <div>
                      <p className="text-body-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                        Chocolate Truffle
                      </p>
                      <p className="text-body-sm text-text-secondary">Rs 350</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div>
                <h3 className="text-h3 text-text-primary mb-sm">Reviews</h3>
                <div className="flex flex-col gap-md">
                  {[
                    {
                      id: 1,
                      user: "Sarah M.",
                      rating: 5,
                      text: "Best coffee in Pokhara! The atmosphere is amazing.",
                    },
                    {
                      id: 2,
                      user: "John D.",
                      rating: 4.5,
                      text: "Great wifi and comfy seating. Perfect for digital nomads.",
                    },
                    {
                      id: 3,
                      user: "Priya K.",
                      rating: 5,
                      text: "The Himalayan Blend is a must-try. loved it!",
                    },
                  ].map((review) => (
                    <div
                      key={review.id}
                      className="p-md rounded-lg bg-background/50 border border-background"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-text-primary">
                          {review.user}
                        </span>
                        <span className="text-primary text-sm flex gap-1">
                          {"⭐".repeat(Math.floor(review.rating))}
                        </span>
                      </div>
                      <p className="text-body-sm text-text-secondary">
                        "{review.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Map & Gallery */}
            <div className="flex flex-col gap-lg">
              {/* Photo Gallery */}
              <div>
                <h3 className="text-h3 text-text-primary mb-sm">Gallery</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-gray-200 overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <img
                        src={`https://source.unsplash.com/random/400x400/?coffee,cafe,interior&sig=${i}`}
                        alt="Gallery"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-background overflow-hidden">
                <div className="relative h-64 w-full">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(content.map.address)}&output=embed&zoom=15`}
                    width="100%"
                    height="100%"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full border-0"
                    title={content.map.title}
                  />
                  <div className="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm rounded-lg px-2 py-1 text-body-xs text-text-secondary">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.map.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between p-md bg-surface">
                  <div>
                    <h4 className="text-body-lg font-semibold text-text-primary">
                      {content.map.title}
                    </h4>
                    <p className="text-body-sm text-text-secondary">
                      {content.map.address}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(content.map.address)}`,
                        "_blank",
                      );
                    }}
                  >
                    {content.map.cta.text}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default App;

