// Route table: maps URLs to lazily loaded pages inside the root layout.
import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layout/root-layout'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, lazy: () => import('@/pages/home-page').then((m) => ({ Component: m.HomePage })) },
      { path: 'todos', lazy: () => import('@/pages/todos-page').then((m) => ({ Component: m.TodosPage })) },
      { path: 'contact', lazy: () => import('@/pages/contact-page').then((m) => ({ Component: m.ContactPage })) },
      { path: '*', lazy: () => import('@/pages/not-found-page').then((m) => ({ Component: m.NotFoundPage })) },
    ],
  },
])
