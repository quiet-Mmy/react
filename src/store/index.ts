// import { configureStore } from '@reduxjs/toolkit';
// import countReducer from './modules/countStore';

// // 👇 redux-persist 相关导入
// // import { persistStore, persistReducer } from 'redux-persist';
// // import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
// // import storage from 'redux-persist/lib/storage'; // 使用 localStorage
// // import { sessionStorage } from 'redux-persist/lib/storage' // 也可以使用 sessionStorage
// // import AsyncStorage from '@react-native-async-storage/async-storage' // 移动端用 AsyncStorage

// // 👇 配置持久化选项
// // const persistConfig = {
// //     key: 'root',           // 存储的 key
// //     storage,               // 存储引擎（localStorage）
// //     whitelist: ['count'],   // 只持久化的 reducer 名称（可选）  优先级高于 blacklist
// //         // blacklist: []       // 不想持久化的 reducer 名称 
// //     version: 1, // 版本号，当 reducer 数据结构变化时(比如新增了一个key 把object放到了这个key下面)，需要更新版本号
// //     debug: process.env.NODE_ENV === 'development', // 开启调试模式，会在控制台打印哪些数据被保存/被恢复/有错误
// //     throttle: 2000, // 2秒保存一次  （默认是1000ms）
// //     stateReconciler: autoMergeLevel2, // 配置 state 合并策略 
// //     // 比如现在存了obj: { user: { name: '苗' }, count: 5 } 现在name是两层 如果现在user要变成obj: { user: { name: '苗', age: 24, }, count: 5, email: '123123' } 
// //     // 那么autoMergeLevel2会自动合并成obj: { user: { name: '苗', age: 24, }, count: 5, email: '123123' }
// //     keyPrefix: 'myapp_', // 自定义前缀，避免与其他应用冲突 存储时变成：keyPrefix的值 + persist: + key的值
// // };

// // 👇 包装 reducer
// const persistedReducer = persistReducer(persistConfig, countReducer);

// // 👇 创建 store
// export const store = configureStore({
//   reducer: {
//     count: persistedReducer
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // redux-persist 会报错，需关闭
//     }),
// });

// // 👇 创建 persistor
// export const persistor = persistStore(store);

// // 💡 原来的 store 还是 export default
// export default store;

import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import countReducer from './modules/countStore'; // 这里导入的是 persistReducer 包装过的
import triggerReducer from './modules/triggerStore';

export const store = configureStore({
  reducer: {
    count: countReducer,
    trigger: triggerReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 关闭 redux-persist 的警告
    }),
});

export const persistor = persistStore(store);

export default store;