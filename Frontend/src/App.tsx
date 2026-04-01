import { Routes, Route, Outlet } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DocsLayout } from "@/layouts/DocsLayout";

// Public Pages
import { Home } from "@/pages/Home";
import { Features } from "@/pages/Features";
import Engine from "@/pages/Engine";
import Enterprise from "@/pages/Enterprise";
import { Pricing } from "@/pages/Pricing";
import { About } from "@/pages/About";
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";

// Dashboard Pages
import { Overview } from "@/pages/dashboard/Overview";
import { TextToImage } from "@/pages/dashboard/TextToImage";
import { History } from "@/pages/dashboard/History";
import { Profile } from "@/pages/dashboard/Profile";
import { WorkstationPlaceholder } from "@/pages/dashboard/WorkstationPlaceholder";

// Docs Pages
import { Introduction } from "@/pages/docs/Introduction";


function App() {
  return (
    <Routes>
      {/* Public Routes with 3D Background */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/engine" element={<Engine />} />
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Dashboard Routes with Sidebar (No 3D Background) */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout children={<Outlet />} />}>
          <Route index element={<Overview />} />
          <Route path="image" element={<TextToImage />} />
          <Route path="text" element={<WorkstationPlaceholder title="Neural Copy" description="The semantic engine is currently calibrating your private latent space logs. High-fidelity copy synthesis will be available in the next cycle." />} />
          <Route path="video" element={<WorkstationPlaceholder title="Text to Video" description="Coming Soon: Neural Motion Synthesis" />} />
          <Route path="vision" element={<WorkstationPlaceholder title="Image to Video" description="Coming Soon: Move your static neural maps into cinematic fluid motion." />} />
          <Route path="campaigns" element={<WorkstationPlaceholder title="Image to Text" description="Reverse neural mapping for deep metadata extraction, SEO analysis, and brand audits." />} />
          <Route path="settings" element={<WorkstationPlaceholder title="Engine Configuration" description="Direct neural parameter access and API key rotation are restricted to enterprise admins during alpha." />} />
          <Route path="support" element={<WorkstationPlaceholder title="Neural Support" description="Our support agents are currently training on your specific brand alignment metrics." />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Documentation Routes */}
      <Route path="/docs" element={<DocsLayout />}>
        <Route index element={<Introduction />} />
      </Route>
    </Routes>
  );
}

export default App;
