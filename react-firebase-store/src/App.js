import './App.css';

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import FireStore from './pages/FireStore';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/firestore' element={<FireStore/>}/>
    </Routes>
  );
}

export default App;
