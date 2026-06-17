# 启字堂部署说明

## 架构说明

Vercel 适合部署前端，后端部署方式：
- **简单方式**（推荐）：
  - 前端部署到 Vercel
  - 后端本地运行，或部署到免费服务（Railway, Render 等）

## 部署步骤

### 1. Git 仓库准备

```bash
cd 你的项目目录
git init
git add .
git commit -m "Initial commit"
```

然后在 GitHub 创建仓库并推送

### 2. Vercel 部署前端

1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 导入刚才的仓库
5. 配置：
   - **Framework Preset**: Vite
   - **Root Directory**: 保持默认
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
6. 点击 Deploy

部署成功后，会得到类似 `https://qizitang.vercel.app` 的地址

### 3. 后端部署选项

#### 选项 A: 本地运行（最简单）

在你的电脑上一直运行后端：
```bash
cd backend
npm install
node app.js
```

然后在前端代码中修改 API 地址为本地

#### 选项 B: 部署到 Railway/Render（免费）

1. 将项目推送到 GitHub
2. 访问 https://railway.app 或 https://render.com
3. 导入仓库，自动部署

## 开发调试

本地运行前后端：

```bash
# 后端
cd backend
npm install
node app.js  # 或 npm run dev

# 前端（新终端）
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173 即可调试

---

## Vercel 配置文件说明

- `vercel.json`: 部署配置
- `.gitignore`: Git 忽略的文件
- `package.json`: 根目录依赖（可选）
