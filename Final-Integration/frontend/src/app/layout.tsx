import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from '../components/ClientLayout';

export const metadata: Metadata = {
  title: 'Smart Local Orchestrator — AI-Powered Service Matching',
  description: 'Find and book trusted local service providers in Karachi using AI-powered matching. Plumbers, electricians, carpenters, painters, and cleaners — matched to your needs instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
