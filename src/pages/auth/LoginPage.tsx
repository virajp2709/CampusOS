import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/config/routes';
import { Button, Input, Card } from '@/components/ui';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, demoLogin } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err?.message || 'Google Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    demoLogin();
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-campus-bg-deep relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-campus-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-campus-accent/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Brand identity */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-campus-primary to-campus-accent shadow-glow-strong mb-4">
            <span className="font-extrabold text-white text-3xl">C</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Campus<span className="text-campus-accent-light">OS</span>
          </h1>
          <p className="text-xs text-campus-text-muted mt-1.5 font-medium">
            Your College. Your Schedule. Your Progress.
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-campus-bg-tertiary border border-campus-border text-[11px] text-campus-primary-light">
            <Sparkles className="w-3 h-3 text-campus-accent-light" />
            <span>Vidya Pratishthan's KBIET • AI & DS (AI-5)</span>
          </div>
        </div>

        <Card className="p-6 md:p-8 backdrop-blur-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-campus-danger/10 border border-campus-danger/30 text-campus-danger text-xs">
              {error}
            </div>
          )}

          {/* Quick Demo Access Button (Guaranteed to work without Firebase credentials) */}
          <div className="mb-6">
            <button
              onClick={handleDemoAccess}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-campus-primary/20 via-campus-accent/15 to-campus-primary/20 hover:from-campus-primary/30 hover:to-campus-accent/30 border border-campus-primary/50 text-white font-medium text-xs transition-all shadow-glow group"
            >
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-7 h-7 rounded-lg bg-campus-primary flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <div className="font-semibold text-white">Instant Student Demo (Roll: 26107337)</div>
                  <div className="text-[10px] text-campus-text-secondary">Batch AI-5c • Pre-configured Profile</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-campus-accent-light group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-campus-border" />
            <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-campus-text-muted">
              Or Sign In With Account
            </span>
            <div className="flex-grow border-t border-campus-border" />
          </div>

          {/* Google Sign In */}
          <Button
            variant="secondary"
            className="w-full justify-center mb-4 text-xs font-semibold"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <Input
                label="Full Name"
                placeholder="e.g. Viraj"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              label="College Email ID"
              type="email"
              placeholder="rollno@vpkbiet.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center mt-2 text-xs font-semibold"
              isLoading={loading}
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              {isSignUp ? 'Create CampusOS Account' : 'Sign In to CampusOS'}
            </Button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="text-center mt-5 pt-4 border-t border-campus-border/60">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-campus-primary-light hover:underline font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'New student? Create your profile'}
            </button>
          </div>
        </Card>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-campus-text-muted text-[11px]">
          <Shield className="w-3.5 h-3.5 text-campus-success" />
          <span>Per-user encrypted data isolation • Firebase Cloud Security</span>
        </div>

        {/* Creator attribution footer */}
        <div className="text-center mt-4 text-xs text-campus-text-secondary font-medium">
          Designed and created by <span className="text-white font-bold">Viraj Pathak</span>
        </div>
      </div>
    </div>
  );
};
