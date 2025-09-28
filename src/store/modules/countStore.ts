// store/modules/countStore.ts
import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 1. 配置持久化
const persistConfig = {
  key: 'count',        // localStorage 中的 key 是：myapp_persist:count
  storage,             // 使用 localStorage
  version: 1,
  keyPrefix: 'myapp_',  // 前缀
};

// 2. 创建 slice
const countStore = createSlice({
  name: 'count',
  initialState: {
    count: 0
  },
  reducers: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
    changeCount(state, action) {
      state.count = action.payload;
    },
  }
});

// 3. 包装成持久化 reducer ✅ 关键一步！
const persistedReducer = persistReducer(persistConfig, countStore.reducer);

// 4. 导出 actions 和 持久化后的 reducer
export const selectCount = (state) => state.count.count;
export const { increment, decrement, changeCount } = countStore.actions;

// ✅ 最关键的一行：导出持久化后的 reducer
export default persistedReducer;