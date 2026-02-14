import {createBrowserRouter} from 'react-router-dom';
import Home from '../pages/Home.tsx';
import {BasicExample, CharacterCardCanvasWithLayout, ScriptEditor, ScriptManager, ScriptOutline} from '../pages/scripts/';
import Movies from '../pages/movie/Movies.tsx';
import Search from '../pages/search/Search.tsx';
import NotFound from '../pages/NotFound.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
    },
    {
        path: '/scripts',
        element: <ScriptManager/>,
    },
    {
        path: '/scripts/editor/:projectId',
        element: <ScriptEditor/>,
    },
    {
        path: '/scripts/outline/:projectId',
        element: <ScriptOutline projectTitle="剧本大纲"/>,
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
        path: '*',
        element: <NotFound/>,
    }
]);

export default router;