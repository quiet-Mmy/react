import React from 'react';
import router from './router';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'; //redux-persist 提供的一个"守门员"组件。
import { Provider } from 'react-redux';
import { store, persistor } from './store';//persistor 创建的持久化引擎
import ThemeProvider from './components/ThemeProvider';
import { App as AntdApp } from 'antd';  // 注意这里需要注册下App
const App = () => {
  return (
    <Provider store={store}>
      {/* PersistGate 就是为了 避免这种闪烁，等数据恢复完再渲染 */}
      {/* loading 可以是任何 React 元素：<Spinner />、<div>正在加载...</div>  不写默认null 空白 */}
      <PersistGate loading={<div>加载中...</div>} persistor={persistor}>
        <ThemeProvider>
          <AntdApp>
            <RouterProvider router={router} />
          </AntdApp>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;