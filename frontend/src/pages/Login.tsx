import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'motion/react';
import { useState } from 'react';
import { login } from '../lib/auth.service';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await login({
        email,
        password,
      });

      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name || '');
      localStorage.setItem('email', user.email);

      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Deadline Zero"
          className="w-10 h-10 object-contain"
        />

        <span className="font-semibold tracking-tight text-lg">
          Deadline Zero
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to sign in to your workspace
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="bg-white/5 border-white/10 h-11 px-4 text-sm focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              <Link
                to="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 border-white/10 h-11 px-4 text-sm focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>

          <Button type="submit" className="w-full h-11 mt-6 font-medium">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-foreground hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}