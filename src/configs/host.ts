export default {
  mock: {
    // 本地mock数据
    API: '',
  },
  development: {
    // 开发环境接口请求
    API: import.meta.env.VITE_API_HOST,
  },
  test: {
    // 测试环境接口地址
    API: 'http://152.136.143.14:8000',
  },
  release: {
    // 正式环境接口地址
    API: 'http://hrapi.bshxc.com',
  },
  production: {
    // 正式环境接口地址
    API: 'http://hrapi.bshxc.com',
  },
};
