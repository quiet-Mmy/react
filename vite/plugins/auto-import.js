import autoImport from 'unplugin-auto-import/vite'

// 这里原本引入的都是 Vue 相关的自动导入，但本项目是 React 项目，应该改为 React 相关
export default function createAutoImport() {
    return autoImport({
        imports: [
            'react'
        ],
        dts: false
    })
}
