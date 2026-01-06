import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SymptomsList } from './pages/SymptomsList';
import { SymptomDetail } from './pages/SymptomDetail';
import { CategoriesPage } from './pages/CategoriesPage';
import { isTauri } from './config/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  // В Tauri приложении скрываем элементы авторизации/редактирования
  // (если они появятся в будущем)
  // const isGuestMode = isTauri; // Используется в компонентах при необходимости

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/symptoms" element={<SymptomsList />} />
            <Route path="/symptoms/:id" element={<SymptomDetail />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
