import React from "react";
import { Provider } from "react-redux";
import store from "./modules/store";
import jiayouzhan from "./assets/jiayouzhan.png";
import ApplicationForm from "components/ApplicationForm/ApplicationForm";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="bg-white">
        <div className="flex justify-between items-center px-4 py-2 pt-4 bg-white border-b-[1px] border-b-gray-500 mx-2">
          <img src={jiayouzhan} alt="" className="w-20 h-10" />
          <div className="font-bold">宝石花人力资源管理系统</div>
        </div>
        <ApplicationForm />
      </div>
    </Provider>
  );
};

export default App;
