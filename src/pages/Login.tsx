import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || 'Failed to sign in');
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-md py-xl">
      <Card className="w-full max-w-md">
        <div className="flex flex-col gap-lg">
          <div className="text-center">
            <h1 className="text-h1 font-bold text-text-primary mb-sm">Welcome Back</h1>
            <p className="text-body-md text-text-secondary">Sign in to your MoodBrew account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            {error && (
              <div className="rounded-lg bg-error/10 border border-error/20 p-md text-body-sm text-error">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-xs">
              <label htmlFor="email" className="text-body-sm font-semibold text-text-primary">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border border-background bg-surface px-md py-3 text-body-md text-text-primary focus:border-primary focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label htmlFor="password" className="text-body-sm font-semibold text-text-primary">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg border border-background bg-surface px-md py-3 text-body-md text-text-primary focus:border-primary focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-center text-body-sm text-text-secondary">
              Don't have an account?{' '}
              <a href="/signup" className="text-primary font-semibold hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
}

