import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRouteComponent from '@/components/ProtectedRoute';
import { Analytics } from '@vercel/analytics/react';

// Lazy load route components
const PublicDecks = lazy(() => import('./pages/PublicDecks'));
const Surveys = lazy(() => import('./pages/Surveys'));
const RewardHistory = lazy(() => import('./pages/RewardHistory'));
const About = lazy(() => import('./pages/About'));
const SpacedRepetition = lazy(() => import('./pages/SpacedRepetition'));
const Pomodoro = lazy(() => import('./pages/Pomodoro'));
const StudyRoadmap = lazy(() => import('./pages/StudyRoadmap'));
const Referral = lazy(() => import('./pages/Referral'));
const BrainDump = lazy(() => import('./pages/BrainDump'));
const WriteMode = lazy(() => import('./pages/WriteMode'));
const CheckpointMode = lazy(() => import('./pages/CheckpointMode'));
const ResourceLibrary = lazy(() => import('./pages/ResourceLibrary'));
const Classroom = lazy(() => import('./pages/Classroom'));
const GradeChecker = lazy(() => import('./pages/GradeChecker'));
const ClassroomGame = lazy(() => import('./pages/ClassroomGame'));
const TowerDefense = lazy(() => import('./pages/TowerDefense'));
const DevDashboard = lazy(() => import('./pages/DevDashboard'));
const SeedDecks = lazy(() => import('./pages/SeedDecks'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Dictionary = lazy(() => import('./pages/Dictionary'));
const ResourceHub = lazy(() => import('./pages/ResourceHub'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const Documentation = lazy(() => import('./pages/Documentation'));
const APTesting = lazy(() => import('./pages/APTesting'));
const SecurityPractices = lazy(() => import('./pages/SecurityPractices'));
const ChemBalance = lazy(() => import('./pages/ChemBalance'));
const APTips = lazy(() => import('./pages/APTips'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseView = lazy(() => import('./pages/CourseView'));
const Notes = lazy(() => import('./pages/Notes'));
const CodeSandbox = lazy(() => import('./pages/CodeSandbox'));
const PeriodicTable = lazy(() => import('./pages/PeriodicTable'));
const IReadyPrep = lazy(() => import('./pages/iReadyPrep'));
const StateTestPrep = lazy(() => import('./pages/StateTestPrep'));
const SATExamInterface = lazy(() => import('./pages/SATExamInterface'));
const Partnership = lazy(() => import('./pages/Partnership'));
const MLAFormatter = lazy(() => import('./pages/MLAFormatter'));
const FriendsAndUsers = lazy(() => import('./pages/FriendsAndUsers'));
const ExamPrep = lazy(() => import('./pages/ExamPrep'));
const DevApprovals = lazy(() => import('./pages/DevApprovals'));
const AITutors = lazy(() => import('./pages/AITutors'));
const Badges = lazy(() => import('./pages/Badges'));

const CustomSignIn = lazy(() => import('@/components/CustomSignIn'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Register = lazy(() => import('./pages/Register'));

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// Clean & Unique Page Fallback Loader
const PageFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-8 text-center space-y-4">
    {/* Logo Spinner Badge */}
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Smooth Rotating Outer Ring */}
      <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
      
      {/* Subtle Inner Glow */}
      <div className="absolute inset-2 bg-violet-500/10 rounded-xl animate-pulse" />

      {/* Cognita Logo */}
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

    {/* Subtitle */}
    <span className="text-xs font-semibold tracking-wide text-neutral-400">
      Loading page...
    </span>
  </div>
);

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>
    <Suspense fallback={<PageFallback />}>
      {children}
    </Suspense>
  </Layout>
  : <Suspense fallback={<PageFallback />}>{children}</Suspense>;

const AuthenticatedApp = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<CustomSignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* All protected app routes */}
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
          <Route path="/PublicDecks" element={<LayoutWrapper currentPageName="PublicDecks"><PublicDecks /></LayoutWrapper>} />
          <Route path="/Surveys" element={<LayoutWrapper currentPageName="Surveys"><Surveys /></LayoutWrapper>} />
          <Route path="/GradeChecker" element={<LayoutWrapper currentPageName="GradeChecker"><GradeChecker /></LayoutWrapper>} />
          <Route path="/RewardHistory" element={<LayoutWrapper currentPageName="RewardHistory"><RewardHistory /></LayoutWrapper>} />
          <Route path="/About" element={<LayoutWrapper currentPageName="About"><About /></LayoutWrapper>} />
          <Route path="/SpacedRepetition" element={<LayoutWrapper currentPageName="SpacedRepetition"><SpacedRepetition /></LayoutWrapper>} />
          <Route path="/Pomodoro" element={<LayoutWrapper currentPageName="Pomodoro"><Pomodoro /></LayoutWrapper>} />
          <Route path="/StudyRoadmap" element={<LayoutWrapper currentPageName="StudyRoadmap"><StudyRoadmap /></LayoutWrapper>} />
          <Route path="/BrainDump" element={<LayoutWrapper currentPageName="BrainDump"><BrainDump /></LayoutWrapper>} />
          <Route path="/WriteMode" element={<LayoutWrapper currentPageName="WriteMode"><WriteMode /></LayoutWrapper>} />
          <Route path="/CheckpointMode" element={<LayoutWrapper currentPageName="CheckpointMode"><CheckpointMode /></LayoutWrapper>} />
          <Route path="/ResourceLibrary" element={<LayoutWrapper currentPageName="ResourceLibrary"><ResourceLibrary /></LayoutWrapper>} />
          <Route path="/Classroom" element={<LayoutWrapper currentPageName="Classroom"><Classroom /></LayoutWrapper>} />
          <Route path="/ClassroomGame" element={<LayoutWrapper currentPageName="ClassroomGame"><ClassroomGame /></LayoutWrapper>} />
          <Route path="/TowerDefense" element={<LayoutWrapper currentPageName="TowerDefense"><TowerDefense /></LayoutWrapper>} />
          <Route path="/SeedDecks" element={<LayoutWrapper currentPageName="SeedDecks"><SeedDecks /></LayoutWrapper>} />
          <Route path="/DevDashboard" element={<LayoutWrapper currentPageName="DevDashboard"><DevDashboard /></LayoutWrapper>} />
          <Route path="/Calculator" element={<LayoutWrapper currentPageName="Calculator"><Calculator /></LayoutWrapper>} />
          <Route path="/Referral" element={<LayoutWrapper currentPageName="Referral"><Referral /></LayoutWrapper>} />
          <Route path="/Dictionary" element={<LayoutWrapper currentPageName="Dictionary"><Dictionary /></LayoutWrapper>} />
          <Route path="/ResourceHub" element={<LayoutWrapper currentPageName="ResourceHub"><ResourceHub /></LayoutWrapper>} />
          <Route path="/TermsAndConditions" element={<LayoutWrapper currentPageName="TermsAndConditions"><TermsAndConditions /></LayoutWrapper>} />
          <Route path="/Documentation" element={<LayoutWrapper currentPageName="Documentation"><Documentation /></LayoutWrapper>} />
          <Route path="/SecurityPractices" element={<LayoutWrapper currentPageName="SecurityPractices"><SecurityPractices /></LayoutWrapper>} />
          <Route path="/APTesting" element={<LayoutWrapper currentPageName="APTesting"><APTesting /></LayoutWrapper>} />
          <Route path="/ChemBalance" element={<LayoutWrapper currentPageName="ChemBalance"><ChemBalance /></LayoutWrapper>} />
          <Route path="/APTips" element={<LayoutWrapper currentPageName="APTips"><APTips /></LayoutWrapper>} />
          <Route path="/Courses" element={<LayoutWrapper currentPageName="Courses"><Courses /></LayoutWrapper>} />
          <Route path="/CourseView" element={<LayoutWrapper currentPageName="CourseView"><CourseView /></LayoutWrapper>} />
          <Route path="/Notes" element={<LayoutWrapper currentPageName="Notes"><Notes /></LayoutWrapper>} />
          <Route path="/CodeSandbox" element={<LayoutWrapper currentPageName="CodeSandbox"><CodeSandbox /></LayoutWrapper>} />
          <Route path="/PeriodicTable" element={<LayoutWrapper currentPageName="PeriodicTable"><PeriodicTable /></LayoutWrapper>} />
          <Route path="/iReadyPrep" element={<LayoutWrapper currentPageName="iReadyPrep"><IReadyPrep /></LayoutWrapper>} />
          <Route path="/StateTestPrep" element={<LayoutWrapper currentPageName="StateTestPrep"><StateTestPrep /></LayoutWrapper>} />
          
          {/* Matches page: "SATPrep" in ExamPrep.jsx while rendering SATExamInterface */}
          <Route path="/SATPrep" element={<LayoutWrapper currentPageName="SATPrep"><SATExamInterface /></LayoutWrapper>} />
          
          <Route path="/Partnership" element={<LayoutWrapper currentPageName="Partnership"><Partnership /></LayoutWrapper>} />
          <Route path="/MLAFormatter" element={<LayoutWrapper currentPageName="MLAFormatter"><MLAFormatter /></LayoutWrapper>} />
          <Route path="/FriendsAndUsers" element={<LayoutWrapper currentPageName="FriendsAndUsers"><FriendsAndUsers /></LayoutWrapper>} />
          <Route path="/ExamPrep" element={<LayoutWrapper currentPageName="ExamPrep"><ExamPrep /></LayoutWrapper>} />
          <Route path="/DevApprovals" element={<LayoutWrapper currentPageName="DevApprovals"><DevApprovals /></LayoutWrapper>} />
          <Route path="/AITutors" element={<LayoutWrapper currentPageName="AITutors"><AITutors /></LayoutWrapper>} />
          <Route path="/Badges" element={<LayoutWrapper currentPageName="Badges"><Badges /></LayoutWrapper>} />
        </Route>{/* end ProtectedRoute */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
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
  )
}

export default App;
