import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-8 transform transition duration-500 hover:shadow-xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 leading-tight">
          四川宝石花人力资源应聘登记
        </h1>
        <button
          onClick={() => navigate("/apply")}
          className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md"
        >
          我要应聘
        </button>
      </div>
    </div>
  );
};

export default HomePage;
