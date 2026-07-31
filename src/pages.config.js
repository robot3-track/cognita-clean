import { lazy, createElement, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import __Layout from './Layout.jsx';

// ─── THREAD-SAFE SUSPENSE WRAPPER very important.. ──────────────────────────────────────────
// This wraps every heavy view inside its own micro-task delay queue.
// It gives the browser's rendering engine a split second to paint the loading screen, keeping the main thread free and the animation spinning smoothly.
const safeLazy = (importFn) => {
  const LazyComponent = lazy(importFn);
  
  return (props) => createElement(
    Suspense,
    {
      fallback: createElement(
        'div',
        { className: 'flex flex-col items-center justify-center min-h-[300px] gap-3 text-center' },
        createElement(Loader2, { className: 'w-7 h-7 text-violet-500 animate-spin' }),
        createElement('p', { className: 'text-xs opacity-50 font-medium' }, 'Initializing modules...')
      )
    },
    createElement(LazyComponent, props)
  );
};

// ─── DEFERRED PAGE IMPORTS ─────────────────────────────────────────────────
const Chat = safeLazy(() => import('./pages/Chat'));
const Compete = safeLazy(() => import('./pages/Compete'));
const Decks = safeLazy(() => import('./pages/Decks'));
const Home = safeLazy(() => import('./pages/Home'));
const MatchingGame = safeLazy(() => import('./pages/MatchingGame'));
const Media = safeLazy(() => import('./pages/Media'));
const Pricing = safeLazy(() => import('./pages/Pricing'));
const Profile = safeLazy(() => import('./pages/Profile'));
const Progress = safeLazy(() => import('./pages/Progress'));
const Scan = safeLazy(() => import('./pages/Scan'));
const Settings = safeLazy(() => import('./pages/Settings'));
const Study = safeLazy(() => import('./pages/Study'));
const StudyGroups = safeLazy(() => import('./pages/StudyGroups'));
const WordScramble = safeLazy(() => import('./pages/WordScramble'));

export const PAGES = {
    "Chat": Chat,
    "Compete": Compete,
    "Decks": Decks,
    "Home": Home,
    "MatchingGame": MatchingGame,
    "Media": Media,
    "Pricing": Pricing,
    "Profile": Profile,
    "Progress": Progress,
    "Scan": Scan,
    "Settings": Settings,
    "Study": Study,
    "StudyGroups": StudyGroups,
    "WordScramble": WordScramble,
};

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};