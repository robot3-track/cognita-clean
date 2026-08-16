import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { pagesConfig } from './pages.config';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRouteComponent from '@/components/ProtectedRoute';
import { Analytics } from '@vercel/analytics/react';

// Public components
const CustomSignIn = lazy(() => import('@/components/CustomSignIn'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Register = lazy(() => import('./pages/Register'));

// Map path overrides for components with different route names or paths
const customRoutes = [
  { path: 'PublicDecks', component: lazy(() => import('./pages/PublicDecks')) },
  { path: 'Surveys', component: lazy(() => import('./pages/Surveys')) },
  { path: 'GradeChecker', component: lazy(() => import('./pages/GradeChecker')) },
  { path: 'RewardHistory', component: lazy(() => import('./pages/RewardHistory')) },
  { path: 'About', component: lazy(() => import('./pages/About')) },
  { path: 'SpacedRepetition', component: lazy(() => import('./pages/SpacedRepetition')) },
  { path: 'Pomodoro', component: lazy(() => import('./pages/Pomodoro')) },
  { path: 'StudyRoadmap', component: lazy(() => import('./pages/StudyRoadmap')) },
  { path: 'BrainDump', component: lazy(() => import('./pages/BrainDump')) },
  { path: 'WriteMode', component: lazy(() => import('./pages/WriteMode')) },
  { path: 'CheckpointMode', component: lazy(() => import('./pages/CheckpointMode')) },
  { path: 'ResourceLibrary', component: lazy(() => import('./pages/ResourceLibrary')) },
  { path: 'Classroom', component: lazy(() => import('./pages/Classroom')) },
  { path: 'ClassroomGame', component: lazy(() => import('./pages/ClassroomGame')) },
  { path: 'TowerDefense', component: lazy(() => import('./pages/TowerDefense')) },
  { path: 'SeedDecks', component: lazy(() => import('./pages/SeedDecks')) },
  { path: 'DevDashboard', component: lazy(() => import('./pages/DevDashboard')) },
  { path: 'Calculator', component: lazy(() => import('./pages/Calculator')) },
  { path: 'Dictionary', component: lazy(() => import('./pages/Dictionary')) },
  { path: 'ResourceHub', component: lazy(() => import('./pages/ResourceHub')) },
  { path: 'TermsAndConditions', component: lazy(() => import('./pages/TermsAndConditions')) },
  { path: 'Documentation', component: lazy(() => import('./pages/Documentation')) },
  { path: 'SecurityPractices', component: lazy(() => import('./pages/SecurityPractices')) },
  { path: 'APTesting', component: lazy(() => import('./pages/APTesting')) },
  { path: 'ChemBalance', component: lazy(() => import('./pages/ChemBalance')) },
  { path: 'APTips', component: lazy(() => import('./pages/APTips')) },
  { path: 'Courses', component: lazy(() => import('./pages/Courses')) },
  { path: 'CourseView', component: lazy(() => import('./pages/CourseView')) },
  { path: 'Notes', component: lazy(() => import('./pages/Notes')) },
  { path: 'CodeSandbox', component: lazy(() => import('./pages/CodeSandbox')) },
  { path: 'PeriodicTable', component: lazy(() => import('./pages/PeriodicTable')) },
  { path: 'iReadyPrep', component: lazy(() => import('./pages/iReadyPrep')) },
  { path: 'StateTestPrep', component: lazy(() => import('./pages/StateTestPrep')) },
  { path: 'SATPrep', component: lazy(() => import('./pages/SATExamInterface')) },
  { path: 'Partnership', component: lazy(() => import('./pages/Partnership')) },
  { path: 'MLAFormatter', component: lazy(() => import('./pages/MLAFormatter')) },
  { path: 'FriendsAndUsers', component: lazy(() => import('./pages/FriendsAndUsers')) },
  { path: 'ExamPrep', component: lazy(() => import('./pages/ExamPrep')) },
  { path: 'DevApprovals', component: lazy(() => import('./pages/DevApprovals')) },
  { path: 'AITutors', component: lazy(() => import('./pages/AITutors')) },
  { path: 'Badges', component: lazy(() => import('./pages/Badges')) },
];

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : () => null;

const PageFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-8 text-center space-y-4">
    <div className="relative w-16 h-16 flex items-center justify-center">
      <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
      <div className="absolute inset-2 bg-violet-500/10 rounded-xl animate-pulse" />
      <div 
        className="relative z-10 w-10 h-10 rounded-xl bg-[var(--app-surface)] border p-1.5 flex items-center justify-center shadow-sm"
        style={{ borderColor: "var(--app-border)" }}
      >
        <img 
          src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
          alt="Cognita" 
          className="w-full h-full object-contain" 
        />
      </div>
    </div>
    <span className="text-xs font-semibold tracking-wide text-neutral-400">Loading page...</span>
  </div>
);

const LayoutWrapper = ({ children, currentPageName }) => {
  if (!Layout) return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
  return (
    <Layout currentPageName={currentPageName}>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </Layout>
  );
};

const AuthenticatedApp = () => (
  <Suspense fallback={<PageFallback />}>
    <Routes>
      <Route path="/login" element={<CustomSignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRouteComponent />}>
        <Route path="/" element={
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        } />
        
        {Object.entries(Pages).map(([path, Page]) => (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <LayoutWrapper currentPageName={path}>
                <Page />
              </LayoutWrapper>
            }
          />
        ))}

        {customRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <LayoutWrapper currentPageName={path}>
                <Component />
              </LayoutWrapper>
            }
          />
        ))}
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </Suspense>
);

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <Analytics />
      </QueryClientProvider>
    </AuthProvider>
  );
}
