import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import store from "./modules/store";
import jiayouzhan from "./assets/jiayouzhan.png";
import ApplicationForm from "components/ApplicationForm/ApplicationForm";
import HomePage from "./components/HomePage";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-white min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-4 py-2 pt-4 max-w-7xl mx-auto">
          <img
            src={jiayouzhan}
            alt="logo"
            className="w-20 h-10 object-contain"
          />
          <h1 className="text-lg font-bold text-gray-800">
            四川宝石花兴川人力资源管理系统
          </h1>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apply" element={<ApplicationForm />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
