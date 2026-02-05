import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { OnboardingLayout } from './components/layout/OnboardingLayout';
import { LandingLayout } from './components/layout/LandingLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Registration';
import AddPet from './pages/AddPet';
import Home from './pages/Home';
import MyPets from './pages/MyPets';
import PetProfile from './pages/PetProfile';
import Scanner from './pages/Scanner';
import ScanResults from './pages/ScanResults';
import History from './pages/History';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route element={<LandingLayout />}>
                    <Route path="/" element={<Landing />} />
                </Route>

                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Onboarding Routes */}
                <Route element={<OnboardingLayout />}>
                    <Route path="/add-pet" element={<AddPet />} />
                </Route>

                {/* Protected Dashboard Routes */}
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/my-pets" element={<MyPets />} />
                    <Route path="/my-pets/:id" element={<PetProfile />} />
                    <Route path="/scanner" element={<Scanner />} />
                    <Route path="/results/:id" element={<ScanResults />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
