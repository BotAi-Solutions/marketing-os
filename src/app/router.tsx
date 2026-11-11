// Route table: public login, then auth-guarded shell with dashboard, generic section list and record pages.
import { createBrowserRouter } from 'react-router'
import { RequireAuth } from '@/app/RequireAuth'
import { AppShell } from '@/components/layout/AppShell'
import { FullPageSpinner } from '@/components/shared/FullPageSpinner'

export const router = createBrowserRouter([
  {
    path: '/login',
    hydrateFallbackElement: <FullPageSpinner />,
    lazy: () => import('@/pages/Login').then((m) => ({ Component: m.Login })),
  },
  {
    element: <RequireAuth />,
    hydrateFallbackElement: <FullPageSpinner />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, lazy: () => import('@/pages/Dashboard').then((m) => ({ Component: m.Dashboard })) },
          { path: ':sectionKey', lazy: () => import('@/pages/SectionPage').then((m) => ({ Component: m.SectionRoute })) },
          { path: ':sectionKey/:recordId', lazy: () => import('@/pages/RecordPage').then((m) => ({ Component: m.RecordRoute })) },
          { path: '*', lazy: () => import('@/pages/NotFound').then((m) => ({ Component: m.NotFound })) },
        ],
      },
    ],
  },
])
