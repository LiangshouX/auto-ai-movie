import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingSpinner from '../pages/scripts/component/scripts-manage/LoadingSpinner.tsx';
import ErrorBoundary from '../components/ErrorBoundary.tsx';

// Lazy load components
const Home = lazy(() => import('../pages/Home.tsx'));
const Movies = lazy(() => import('../pages/movie/Movies.tsx'));
const Search = lazy(() => import('../pages/search/Search.tsx'));
const NotFound = lazy(() => import('../pages/NotFound.tsx'));
const Portal = lazy(() => import('../pages/portal/Portal.tsx'));
const WorkspaceLayout = lazy(() => import('../pages/workspace/WorkspaceLayout.tsx'));
const WorkspacePlaceholder = lazy(() => import('../pages/workspace/WorkspacePlaceholder.tsx'));
const ScriptCreationLayout = lazy(() => import('../pages/workspace/ScriptCreationLayout.tsx'));
const LegacyScriptRedirect = lazy(() => import('../pages/workspace/LegacyScriptRedirect.tsx'));

// Import directly to avoid barrel file issues with lazy loading
const ScriptManager = lazy(() => import('../pages/scripts/component/scripts-manage/ScriptManager.tsx'));
const CharacterCardCanvasWithLayout = lazy(() => import('../pages/scripts/component/scripts-character-role/canvas/CharacterCardCanvasWithLayout.tsx'));
const BasicExample = lazy(() => import('../pages/scripts/component/scripts-character-role/canvas/TLDrawBasic.tsx'));

const withSuspense = (Component: React.LazyExoticComponent<any>) => (
    <Suspense fallback={<LoadingSpinner />}>
        <Component />
    </Suspense>
);

const withSuspenseAndProps = (Component: React.LazyExoticComponent<any>, props: any) => (
    <Suspense fallback={<LoadingSpinner />}>
        <Component {...props} />
    </Suspense>
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/portal" replace />,
        errorElement: <ErrorBoundary />
    },
    {
        path: '/portal',
        element: withSuspense(Portal),
        errorElement: <ErrorBoundary />
    },
    {
        path: '/workspace',
        element: withSuspense(ScriptManager),
        errorElement: <ErrorBoundary />
    },
    {
        path: '/workspace/:projectId',
        element: withSuspense(WorkspaceLayout),
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <Navigate to="script" replace />
            },
            {
                path: 'script/*',
                element: withSuspense(ScriptCreationLayout),
                errorElement: <ErrorBoundary />
            },
            {
                path: 'characters',
                element: withSuspenseAndProps(WorkspacePlaceholder, { title: "角色设计" }),
                errorElement: <ErrorBoundary />
            },
            {
                path: 'storyboard',
                element: withSuspenseAndProps(WorkspacePlaceholder, { title: "画面分镜" }),
                errorElement: <ErrorBoundary />
            },
            {
                path: 'voice',
                element: withSuspenseAndProps(WorkspacePlaceholder, { title: "人物配音" }),
                errorElement: <ErrorBoundary />
            },
            {
                path: 'bgm',
                element: withSuspenseAndProps(WorkspacePlaceholder, { title: "BGM" }),
                errorElement: <ErrorBoundary />
            },
            {
                path: 'compose',
                element: withSuspenseAndProps(WorkspacePlaceholder, { title: "视频合成" }),
                errorElement: <ErrorBoundary />
            },
            {
                path: 'monitor',
                element: withSuspenseAndProps(WorkspacePlaceholder, { title: "数据监控" }),
                errorElement: <ErrorBoundary />
            }
        ]
    },
    {
        path: '/scripts',
        element: <Navigate to="/workspace" replace />,
        errorElement: <ErrorBoundary />
    },
    {
        path: '/scripts/editor/:projectId',
        element: withSuspense(LegacyScriptRedirect),
        errorElement: <ErrorBoundary />
    },
    {
        path: '/scripts/outline/:projectId',
        element: withSuspense(LegacyScriptRedirect),
        errorElement: <ErrorBoundary />
    },
    {
        path: 'characters',
        element: withSuspense(CharacterCardCanvasWithLayout),
        errorElement: <ErrorBoundary />
    },
    {
        path: 'tlDemo',
        element: withSuspense(BasicExample),
        errorElement: <ErrorBoundary />
    },
    {
        path: '/movies',
        element: withSuspense(Movies),
        errorElement: <ErrorBoundary />
    },
    {
        path: '/search',
        element: withSuspense(Search),
        errorElement: <ErrorBoundary />
    },
    {
        path: '/home',
        element: withSuspense(Home),
        errorElement: <ErrorBoundary />
    },
    {
        path: '*',
        element: withSuspense(NotFound),
        errorElement: <ErrorBoundary />
    }
]);

export default router;
