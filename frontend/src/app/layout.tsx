import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../hooks/useAuth';
import { Navbar } from '../components/layout/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow — Task Manager',
  description: 'A clean, powerful task management app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* AuthProvider wraps everything so any component can access auth state */}
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
            {children}
          </main>

          {/* Toast notifications — react-hot-toast renders here */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                background: '#1f2937',
                color: '#f9fafb',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
