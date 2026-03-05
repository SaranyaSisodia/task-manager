'use client';

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { CheckCircle, Zap, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center animate-fade-in">
      {/* Hero */}
      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-sm font-medium mb-8 border border-brand-100">
          <Zap size={14} />
          Simple. Powerful. Yours.
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Manage tasks
          <span className="block text-brand-600">without the noise</span>
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto">
          TaskFlow helps you stay on top of your work with a clean interface and powerful filtering.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/register">
            <Button size="lg" className="w-full sm:w-auto">
              Start for free <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Sign in
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature list */}
      <div className="grid sm:grid-cols-3 gap-6 mt-20 max-w-3xl w-full">
        {[
          { icon: CheckCircle, title: 'Full CRUD', desc: 'Create, edit, delete and toggle tasks in seconds' },
          { icon: Zap,         title: 'Smart Filters', desc: 'Filter by status, search by title, paginate results' },
          { icon: Shield,      title: 'Secure Auth',   desc: 'JWT-based auth with auto token refresh' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 text-left hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
              <Icon size={20} className="text-brand-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
