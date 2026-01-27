import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import Home from '../pages/Home.jsx';
import ScriptManager from '../pages/scripts/index.jsx';
import ScriptEditor from '../pages/scripts/ScriptEditor.jsx';
import Movies from '../pages/Movies.jsx';
import Search from '../pages/Search.jsx';
import NotFound from '../pages/NotFound.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
        meta: {
          title: 'Home - Auto AI Movie',
          description: '首页'
        }
      },
      {
        path: '/scripts',
        element: <ScriptManager />,
        meta: {
          title: '剧本管理',
          description: '剧本管理'
        }
      },
      {
        path: '/scripts/editor/:projectId',
        element: <ScriptEditor />,
        meta: {
          title: '剧本编辑器',
          description: 'AI剧本编辑界面'
        }
      },
      {
        path: '/movies',
        element: <Movies />,
        meta: {
          title: '电影制作',
          description: '电影制作页面'
        }
      },
      {
        path: '/search',
        element: <Search />,
        meta: {
          title: '内容搜索',
          description: '内容搜索页面'
        }
      },
      {
        path: '*',
        element: <NotFound />,
        meta: {
          title: '页面未找到 - Auto AI Movie',
          description: '您访问的页面不存在'
        }
      }
    ]
  }
]);

export default router;