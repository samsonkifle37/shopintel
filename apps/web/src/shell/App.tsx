import { Badge, Frame, Navigation, Page } from "@shopify/polaris";
import { NavLink, Route, Routes } from "react-router-dom";
import { AdsPage } from "../views/AdsPage";
import { AlertsPage } from "../views/AlertsPage";
import { CreatorsPage } from "../views/CreatorsPage";
import { DashboardPage } from "../views/DashboardPage";
import { DiscoveryPage } from "../views/DiscoveryPage";
import { OnboardingPage } from "../views/OnboardingPage";
import { ProductsPage } from "../views/ProductsPage";
import { RecommendationsPage } from "../views/RecommendationsPage";
import { ReportsPage } from "../views/ReportsPage";
import { SettingsPage } from "../views/SettingsPage";
import { ShopsPage } from "../views/ShopsPage";
import { SourcingPage } from "../views/SourcingPage";
import { TikTokIntelligencePage } from "../views/TikTokIntelligencePage";
import { TrackersPage } from "../views/TrackersPage";

export function App() {
  const items = [
    { label: "Dashboard", url: "/" },
    { label: "Discovery", url: "/discovery" },
    { label: "Products", url: "/products" },
    { label: "TikTok Intelligence", url: "/tiktok-intelligence" },
    { label: "Shops", url: "/shops" },
    { label: "Creators", url: "/creators" },
    { label: "Ads", url: "/ads" },
    { label: "Sourcing", url: "/sourcing" },
    { label: "Trackers", url: "/trackers" },
    { label: "Recommendations", url: "/recommendations" },
    { label: "Reports", url: "/reports" },
    { label: "Alerts", url: "/alerts" },
    { label: "Onboarding", url: "/onboarding" },
    { label: "Settings", url: "/settings" }
  ];

  return (
    <Frame
      navigation={
        <Navigation location={window.location.pathname}>
          <Navigation.Section
            items={items.map((item) => ({
              ...item,
              component: NavLink
            }))}
          />
        </Navigation>
      }
    >
      <Page
        title="Commerce Intelligence OS"
        subtitle="Shopify + TikTok Shop + Sourcing intelligence platform"
        titleMetadata={<Badge tone="success">Multi-channel</Badge>}
      >
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/discovery" element={<DiscoveryPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/tiktok-intelligence" element={<TikTokIntelligencePage />} />
            <Route path="/shops" element={<ShopsPage />} />
            <Route path="/creators" element={<CreatorsPage />} />
            <Route path="/ads" element={<AdsPage />} />
            <Route path="/sourcing" element={<SourcingPage />} />
            <Route path="/trackers" element={<TrackersPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </Page>
    </Frame>
  );
}
