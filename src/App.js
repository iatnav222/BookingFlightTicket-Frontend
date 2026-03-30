import './App.css';
import Users from './Users';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />

        <main className="flex-grow container mx-auto px-4 mt-10">
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/" element={
              <div className="text-center mt-10 p-10 bg-white shadow rounded-xl">
                <h1 className="text-3xl font-bold text-blue-600">
                  Chào mừng đến với hệ thống đặt vé
                </h1>
               
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;