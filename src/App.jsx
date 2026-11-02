import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import GooseShell from '@/components/GooseShell';
import Home from '@/pages/Home';
import Country from '@/pages/Country';
import Citizenship from '@/pages/Citizenship';
import Translator from '@/pages/Translator';
import Chat from '@/pages/Chat';
import Alphabet from '@/pages/Alphabet';
import Dictionary from '@/pages/Dictionary';
import Laws from '@/pages/Laws';
import Grammar from '@/pages/Grammar';
import Admin from '@/pages/Admin';
import Passport from '@/pages/Passport';
import Games from '@/pages/Games';
import Shop from '@/pages/Shop';
import Market from '@/pages/Market';
import News from '@/pages/News';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<GooseShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/country" element={<Country />} />
        <Route path="/citizenship" element={<Citizenship />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/alphabet" element={<Alphabet />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/laws" element={<Laws />} />
        <Route path="/grammar" element={<Grammar />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="/games" element={<Games />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/market" element={<Market />} />
        <Route path="/news" element={<News />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App