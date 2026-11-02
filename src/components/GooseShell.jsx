import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import GooseSidebar from '@/components/GooseSidebar';
import GooseHeader from '@/components/GooseHeader';
import { CitizenProvider } from '@/hooks/useCitizen';

export default function GooseShell() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <CitizenProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="grain-overlay" aria-hidden="true" />
        <GooseSidebar open={open} onClose={() => setOpen(false)} />

        <div className="md:pl-[262px]">
          <GooseHeader onOpenNav={() => setOpen(true)} />

          <main className="px-4 pb-24 pt-8 md:px-10 md:pt-10">
            <Outlet />
          </main>
        </div>
      </div>
    </CitizenProvider>
  );
}