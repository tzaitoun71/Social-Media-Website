import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Homepage } from './Homepage';
import { UserProvider } from './UserContext';
import { ChatHome } from './chat/ChatHome';


function App() {
  return (
    <div>
      <Router>
        <UserProvider>
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/inbox' element={<ChatHome />} />
          </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App
