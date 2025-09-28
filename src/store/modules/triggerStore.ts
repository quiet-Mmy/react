import { createSlice, createSelector } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// 1. 配置持久化
const persistConfig = {
    key: 'trigger', // localStorage 中的 key 是：myapp_persist:count
    storage, // 使用 localStorage
    version: 1,
    keyPrefix: 'myapp_' // 前缀
}

// 2. 创建 slice
const triggerStore = createSlice({
    name: 'trigger',
    initialState: {
        trigger: 'sun', //触发主题 日月
        menuShow: true, //侧边栏收起
        showFooter: false,
        showBreadcrumb: false,
        syncTitle: true
    },
    reducers: {
        changeTrigger(state, action) {
            state.trigger = action.payload
        },
        changeMenuShow(state, action) {
            state.menuShow = action.payload
        },
        setShowFooter(state, action) {
            state.showFooter = action.payload
        },
        setShowBreadcrumb(state, action) {
            state.showBreadcrumb = action.payload
        },
        setSyncTitle(state, action) {
            state.syncTitle = action.payload
        },
        // Tabs
        initTabs(state, action) {
            const { pathname, title } = action.payload || {}
            const home = { key: '/', title: '首页', path: '/' }
            state.openTabs = state.openTabs?.length ? state.openTabs : [home]
            state.activeKey = state.activeKey || pathname || '/'
            if (pathname && pathname !== '/' && title) {
                const exists = state.openTabs.find(t => t.key === pathname)
                if (!exists) state.openTabs.push({ key: pathname, title, path: pathname })
                state.activeKey = pathname
            }
        },
        addTab(state, action) {
            const { key, title, path } = action.payload
            const exists = state.openTabs?.find(t => t.key === key)
            if (!exists) state.openTabs = [...(state.openTabs || []), { key, title, path }]
            state.activeKey = key
        },
        removeTab(state, action) {
            const key = action.payload
            const tabs = state.openTabs || []
            const idx = tabs.findIndex(t => t.key === key)
            if (idx === -1) return
            const newTabs = tabs.filter(t => t.key !== key)
            state.openTabs = newTabs
            if (state.activeKey === key) {
                const fallback = newTabs[idx - 1] || newTabs[0] || { key: '/' }
                state.activeKey = fallback.key
            }
        },
        setActiveTab(state, action) {
            state.activeKey = action.payload
        },
        closeAllTabs(state) {
            const home = { key: '/', title: '首页', path: '/' }
            state.openTabs = [home]
            state.activeKey = '/'
        },
        closeOtherTabs(state, action) {
            const key = action.payload || state.activeKey || '/'
            const tabs = state.openTabs || []
            const keep = tabs.find(t => t.key === key) || { key: '/', title: '首页', path: '/' }
            const home = tabs.find(t => t.key === '/') || { key: '/', title: '首页', path: '/' }
            const result = key === '/' ? [home] : [home, keep].filter((v, i, arr) => arr.findIndex(x => x.key === v.key) === i)
            state.openTabs = result
            state.activeKey = keep.key
        }
    },
    extraReducers: builder => {
        builder.addCase('persist/REHYDRATE', (state, action) => {
            // 1. 恢复 Redux 状态
            if (action.payload?.trigger) {
                state.trigger = action.payload.trigger
            } else {
                // 如果没有持久化数据，用系统偏好
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                state.trigger = prefersDark ? 'moon' : 'sun'
            }

            // 2.  立刻同步 DOM，避免闪烁
            if (state.trigger === 'moon') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }

            // 3. 添加初始化标记（可选）
            document.documentElement.classList.add('theme-initialized')
        })
    }
})

// 3. 包装成持久化 reducer 关键一步！
const persistedReducer = persistReducer(persistConfig, triggerStore.reducer)

// 4. 导出 actions 和 持久化后的 reducer
export const selectTrigger = state => state.trigger.trigger
export const selectMenuShow = state => state.trigger.menuShow
export const selectShowFooter = state => state.trigger.showFooter
export const selectShowBreadcrumb = state => state.trigger.showBreadcrumb
export const selectSyncTitle = state => state.trigger.syncTitle
// 使用createSelector进行记忆化，避免不必要的重渲染
export const selectTabs = createSelector(
    state => state.trigger.openTabs,
    state => state.trigger.activeKey,
    (openTabs = [], activeKey = '/') => ({ openTabs, activeKey })
);

export const { changeTrigger, changeMenuShow, setShowFooter, setShowBreadcrumb, setSyncTitle, initTabs, addTab, removeTab, setActiveTab } = triggerStore.actions

// ✅ 最关键的一行：导出持久化后的 reducer
export default persistedReducer