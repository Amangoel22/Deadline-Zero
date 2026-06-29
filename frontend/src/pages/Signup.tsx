import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { signup } from '../lib/auth.service';

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await signup({
        name,
        email,
        password,
      });

      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name || '');
      localStorage.setItem('email', user.email);

      navigate('/onboarding');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
          <Zap className="w-3 h-3 text-primary-foreground" />
        </div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Start doing your best work, distraction-free
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Full Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="bg-white/5 border-white/10 h-11 px-4 text-sm focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>

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
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="bg-white/5 border-white/10 h-11 px-4 text-sm focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>

          <Button type="submit" className="w-full h-11 mt-6 font-medium">
            Continue
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-foreground hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}