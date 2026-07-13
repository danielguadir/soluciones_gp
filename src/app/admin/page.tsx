'use client';

import { Suspense } from 'react';
import AdminPanelContent from './content';

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    }>
      <AdminPanelContent />
    </Suspense>
  );
}
