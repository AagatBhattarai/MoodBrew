import { useEffect } from "react";
import { useStore } from "@/store";
import {
  moodConfigs,
  mockWeather,
  dailyChallenges,
  leaderboardData,
} from "@/data";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { Toast } from "@/components/Toast";
import { HomeView } from "@/views/HomeView";
import { ProductsView } from "@/views/ProductsView";
import { ProductDetailView } from "@/views/ProductDetailView";
import { CafesView } from "@/views/CafesView";
import { CafeDetailView } from "@/views/CafeDetailView";
import { OrdersView } from "@/views/OrdersView";
import { RankingsView } from "@/views/RankingsView";
import { ProfileView } from "@/views/ProfileView";
import { EditProfileView } from "@/views/EditProfileView";
import { PaymentMethodsView } from "@/views/PaymentMethodsView";
import { SavedAddressesView } from "@/views/SavedAddressesView";
import { NotificationsView } from "@/views/NotificationsView";
import { PrivacySecurityView } from "@/views/PrivacySecurityView";
import { SettingsView } from "@/views/SettingsView";
import { LoginView } from "@/views/LoginView";
import { SignupView } from "@/views/SignupView";
import { AdminDashboardView } from "@/views/admin/AdminDashboardView";
import "./App.css";

function App() {
  const {
    currentView,
    isAuthenticated,
    setView,
    setWeather,
    setDailyChallenges,
    setLeaderboard,
    currentMood,
  } = useStore();

  useEffect(() => {
    // Initialize mock data
    setWeather(mockWeather);
    setDailyChallenges(dailyChallenges);
    setLeaderboard(leaderboardData);
  }, [setWeather, setDailyChallenges, setLeaderboard]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated && !["login", "signup"].includes(currentView)) {
      setView("login");
    }
  }, [isAuthenticated, currentView, setView]);

  const renderView = () => {
    switch (currentView) {
      case "login":
        return <LoginView />;
      case "signup":
        return <SignupView />;
      case "home":
        return <HomeView />;
      case "products":
        return <ProductsView />;
      case "product-detail":
        return <ProductDetailView />;
      case "cafes":
        return <CafesView />;
      case "cafe-detail":
        return <CafeDetailView />;
      case "orders":
        return <OrdersView />;
      case "rankings":
        return <RankingsView />;
      case "profile":
        return <ProfileView />;
      case "edit-profile":
        return <EditProfileView />;
      case "payment-methods":
        return <PaymentMethodsView />;
      case "saved-addresses":
        return <SavedAddressesView />;
      case "notifications":
        return <NotificationsView />;
      case "privacy-security":
        return <PrivacySecurityView />;
      case "settings":
        return <SettingsView />;
      case "admin-dashboard":
        return <AdminDashboardView />;
      default:
        return <HomeView />;
    }
  };

  const currentMoodConfig = moodConfigs.find((m) => m.id === currentMood);
  const moodColor = currentMoodConfig?.color || "hsl(25 70% 55%)";

  return (
    <div
      className="min-h-screen transition-colors duration-700"
      style={{
        background: currentMood
          ? `linear-gradient(135deg, hsl(220 20% 8%) 0%, ${moodColor.replace(")", " / 0.15)")} 50%, hsl(220 20% 8%) 100%)`
          : "hsl(220 20% 8%)",
      }}
    >
      {/* Only show standard navigation if authenticated and NOT in admin view */}
      {isAuthenticated && currentView !== "admin-dashboard" && <Navigation />}

      <main
        className={`${isAuthenticated && currentView !== "admin-dashboard" ? "pb-20 md:pb-0 md:pt-16" : ""} min-h-screen`}
      >
        {renderView()}
      </main>

      {isAuthenticated && currentView !== "admin-dashboard" && <BottomNav />}
      <Toast />
    </div>
  );
}

export default App;
