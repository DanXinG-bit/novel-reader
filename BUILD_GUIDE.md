# GitHub Actions + Capacitor APK 构建参考

## 前提

- `@capacitor/core` `@capacitor/cli` `@capacitor/android` 已安装
- `capacitor.config.ts` 已配置（webDir 指向 dist）
- `package.json` 含 `"packageManager": "pnpm@x.y.z"`

## GitHub Actions 工作流

文件：`.github/workflows/build-apk.yml`

```yaml
name: Build Android APK
on:
  push:
    branches: [master, main]
  workflow_dispatch:  # 允许手动触发

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: 'true'  # 消除 Node 20 弃用警告

    steps:
      1. checkout@v4
      2. pnpm/action-setup@v4   （从 packageManager 字段读取版本）
      3. setup-node@v4          node-version: '22'
      4. pnpm install --frozen-lockfile
      5. pnpm build             → 产出 dist/
      6. npx cap add android    → 生成 android/ 工程（不需要 SDK）
      7. npx cap sync           → 把 dist/ 灌入 android/
      8. setup-java@v4          distribution: temurin  java-version: '21'
      9. setup-android@v3       （安装 Android SDK）
      10. yes | sdkmanager --licenses
      11. chmod +x android/gradlew
      12. cd android && ./gradlew assembleDebug
      13. upload-artifact@v4    → 可下载 APK

```

## 关键坑位

| 问题 | 原因 | 解决 |
|------|------|------|
| `pnpm version not specified` | 缺少 packageManager 字段 | package.json 加 `"packageManager": "pnpm@x.y.z"` |
| `ERR_PNPM_BAD_PM_VERSION` | workflow 和 package.json 同时指定了 pnpm 版本 | 只保留 package.json 中的 |
| `ERR_UNKNOWN_BUILTIN_MODULE: node:sqlite` | pnpm 11 需要 Node ≥ 22.13 | node-version 设为 '22' |
| `invalid source release: 21` | Capacitor 8 需要 Java 21 编译 | java-version 设为 '21' |
| Node 20 deprecation warning | GitHub 将于 2026-06-02 默认切 Node 24 | 加 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: 'true'`（仅消除警告，不影响构建） |

## 获取 APK

构建成功后 → Actions 页面 → 进对应 job → 底部 Artifacts → `novel-reader-apk` → 下载 `.zip`，解压得到 `.apk`

## 提交即构建

每次 `git push` 到 master/main 自动触发。也可手动：Actions → Build Android APK → Run workflow。
