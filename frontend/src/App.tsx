import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ArtistDetailPage from "./pages/ArtistDetailPage";
import ArtistsPage from "./pages/ArtistsPage";
import CommunityPage from "./pages/CommunityPage";
import CompositionsPage from "./pages/CompositionsPage";
import ContributePage from "./pages/ContributePage";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import ExplorePage from "./pages/ExplorePage";
import GharanaDetailPage from "./pages/GharanaDetailPage";
import GharanasPage from "./pages/GharanasPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MovementsPage from "./pages/MovementsPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import TaalTerminologyPage from "./pages/TaalTerminologyPage";

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-ivory text-stone-800">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/gharanas" element={<GharanasPage />} />
            <Route path="/gharanas/:slug" element={<GharanaDetailPage />} />
            <Route path="/taal-terminology" element={<TaalTerminologyPage />} />
            <Route path="/compositions" element={<CompositionsPage />} />
            <Route path="/movements" element={<MovementsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artists/:slug" element={<ArtistDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/contribute" element={<ContributePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
