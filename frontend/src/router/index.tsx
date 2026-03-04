import {createBrowserRouter, Navigate} from 'react-router-dom';
import Home from '../pages/Home.tsx';
import {BasicExample, CharacterCardCanvasWithLayout, ScriptManager} from '../pages/scripts/';
import Movies from '../pages/movie/Movies.tsx';
import Search from '../pages/search/Search.tsx';
import NotFound from '../pages/NotFound.tsx';
import Portal from '../pages/portal/Portal.tsx';
import WorkspaceLayout from '../pages/workspace/WorkspaceLayout.tsx';
import WorkspacePlaceholder from '../pages/workspace/WorkspacePlaceholder.tsx';
import ScriptCreationLayout from '../pages/workspace/ScriptCreationLayout.tsx';
import LegacyScriptRedirect from '../pages/workspace/LegacyScriptRedirect.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/portal" replace/>
    },
    {
        path: '/portal',
        element: <Portal/>
    },
    {
        path: '/workspace',
        element: <ScriptManager/>
    },
    {
        path: '/workspace/:projectId',
        element: <WorkspaceLayout/>,
        children: [
            {
                index: true,
                element: <Navigate to="script" replace/>
            },
            {
                path: 'script/*',
                element: <ScriptCreationLayout/>
            },
            {
                path: 'characters',
                element: <WorkspacePlaceholder title="角色设计"/>
            },
            {
                path: 'storyboard',
                element: <WorkspacePlaceholder title="画面分镜"/>
            },
            {
                path: 'voice',
                element: <WorkspacePlaceholder title="人物配音"/>
            },
            {
                path: 'bgm',
                element: <WorkspacePlaceholder title="BGM"/>
            },
            {
                path: 'compose',
                element: <WorkspacePlaceholder title="视频合成"/>
            },
            {
                path: 'monitor',
                element: <WorkspacePlaceholder title="数据监控"/>
            }
        ]
    },
    {
        path: '/scripts',
        element: <Navigate to="/workspace" replace/>
    },
    {
        path: '/scripts/editor/:projectId',
        element: <LegacyScriptRedirect/>
    },
    {
        path: '/scripts/outline/:projectId',
        element: <LegacyScriptRedirect/>
    },
    {
        path: 'characters',
        element: <CharacterCardCanvasWithLayout/>
    },
    {
        path: 'tlDemo',
        // element: <CharacterCardCanvasWithLayout/>
        element: <BasicExample/>
    },
    {
        path: '/movies',
        element: <Movies/>,
    },
    {
        path: '/search',
        element: <Search/>,
    },
    {
        path: '/home',
        element: <Home/>
    },
    {
        path: '*',
        element: <NotFound/>,
    }
]);

export default router;
