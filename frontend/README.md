# Auto AI Movie Frontend

## 全局主题系统

- 主题令牌定义在 `src/theme.ts`，包含 `light` 与 `dark` 两套语义化 token。
- 运行时主题控制在 `src/theme-provider.tsx`，默认遵循系统主题，并将用户选择持久化到 `localStorage`。
- 主题切换组件在 `src/components/ThemeSwitch.tsx`，已接入页面头部右侧。
- 全局 CSS 变量在 `src/index.css`，所有新增样式请优先使用 `var(--color-*)` 与 `var(--shadow-*)`。

## 主题使用规范

- 组件样式禁止硬编码颜色值，统一使用主题变量。
- 需要 Ant Design 组件主题能力时，使用 `ConfigProvider` 注入的全局 token。
- 需要 Emotion 主题能力时，使用 `useTheme` 读取 `AppTheme`。

## 本地开发

```bash
npm install
npm run dev
```

## 验证主题切换

- 在任意页面头部右侧点击主题切换开关。
- 刷新页面后应保持上次选择的主题。
- 将系统主题改为深色并清理本地存储后，页面应自动跟随系统主题。
