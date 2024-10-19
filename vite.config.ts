// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true // 允许局域网访问，方便手机测试
//   }
// })

import path from "path";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const CWD = process.cwd();

export default (params: any) => {
  const { mode } = params;
  const { VITE_BASE_URL } = loadEnv(mode, CWD);

  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        assets: path.resolve(__dirname, "./src/assets"),
        components: path.resolve(__dirname, "./src/components"),
        configs: path.resolve(__dirname, "./src/configs"),
        layouts: path.resolve(__dirname, "./src/layouts"),
        modules: path.resolve(__dirname, "./src/modules"),
        pages: path.resolve(__dirname, "./src/pages"),
        styles: path.resolve(__dirname, "./src/styles"),
        utils: path.resolve(__dirname, "./src/utils"),
        services: path.resolve(__dirname, "./src/services"),
        router: path.resolve(__dirname, "./src/router"),
        hooks: path.resolve(__dirname, "./src/hooks"),
        types: path.resolve(__dirname, "./src/types"),
        custome: path.resolve(__dirname, "./src/assets/css/custom"),
      },
    },

    plugins: [react()],

    server: {
      host: true,
    },
  };
};
