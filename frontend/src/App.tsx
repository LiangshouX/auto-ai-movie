import './App.css'
import {Outlet} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      {/* 已移除组件 <Header />*/}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App