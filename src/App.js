import './App.css';
import Users from './Users';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App bg-light min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">Hệ thống Đặt vé</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item fw-bold shadow-sm">
                  <Link className="nav-link btn btn-outline-dark border-0" to="/users">
                    Quản lý Users
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-5">
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/" element={
              <div className="text-center mt-5 p-5 bg-white shadow-sm rounded">
                <h1 className="text-primary fw-bold">Chào mừng đến với hệ thống đặt vé</h1>
                <p className="lead text-muted mt-3">Vui lòng chọn "Quản lý Users" trên thanh điều hướng để xem danh sách.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;