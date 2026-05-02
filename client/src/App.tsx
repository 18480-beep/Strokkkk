import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/Home";
import Login from "./pages/Login";

const GOOGLE_CLIENT_ID = "646631333559-7v96h1d1gelfnjfi4srr6elvvv79lt6p.apps.googleusercontent.com";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Component /> : <Redirect to="/login" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <ProtectedRoute component={Home} />}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <AuthProvider>
              <Router />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
}

export default App;