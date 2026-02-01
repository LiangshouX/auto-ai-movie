import {createBrowserRouter} from 'react-router-dom';
import Home from '../pages/Home.tsx';
import ScriptManager from '../pages/scripts/component/scripts-manage/ScriptManager.tsx';
import ScriptEditor from '../pages/scripts/component/scripts-manage/ScriptEditor.tsx';
import ScriptOutline from '../pages/scripts/component/scripts-outline-chapter/ScriptOutline.tsx';
import Movies from '../pages/movie/Movies.tsx';
import Search from '../pages/search/Search.tsx';
import NotFound from '../pages/NotFound.tsx';
import CharacterManager from "../pages/scripts/component/scripts-character-role/CharacterManager.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/scripts',
    element: <ScriptManager />,
  },
  {
    path: '/scripts/editor/:projectId',
    element: <ScriptEditor />,
  },
  {
    path: '/scripts/outline/:projectId',
    element: <ScriptOutline projectTitle="剧本大纲" />,
  },
  {
    path: 'characters',
    element: <CharacterManager/>
  },
  {
    path: '/movies',
    element: <Movies />,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

export default router;