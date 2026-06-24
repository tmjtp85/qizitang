# 启字堂 Render 部署指南

## 📋 前提条件
1. GitHub 账号
2. 项目已推送到 GitHub (https://github.com/tmjtp85/qizitang)

---

## 🚀 部署步骤

### 1. 登录/注册 Render
- 访问 https://render.com
- 点击右上角 "Get Started"
- 使用 GitHub 账号登录（推荐）

---

### 2. 创建新服务
1. 登录后进入 Dashboard
2. 点击右上角 "New +" 按钮
3. 选择 "Web Service"

---

### 3. 连接 GitHub 仓库
1. 点击 "Connect a Repository"
2. 授权 Render 访问你的 GitHub 仓库
3. 选择你的仓库 `tmjtp85/qizitang`

---

### 4. 配置服务
1. **Name**: `qizitang-backend`
2. **Region**: Singapore (新加坡，国内访问快)
3. **Branch**: `main`
4. **Runtime**: Node
5. **Build Command**: `cd backend && npm install`
6. **Start Command**: `cd backend && node app.js`
7. **Instance Type**: Free (免费)

---

### 5. 添加环境变量（可选，但推荐）
1. 点击 "Environment" 标签页
2. 添加以下变量：
   - Key: `DATA_DIR`, Value: `/data`
   - Key: `NODE_ENV`, Value: `production`

---

### 6. 添加持久化数据盘（重要！）
1. 点击 "Disk" 标签页
2. **名称**: `data`
3. **挂载路径**: `/data`
4. **大小**: 1GB (免费)
5. 点击 "Save"

---

### 7. 部署！
1. 检查所有配置都正确
2. 点击底部 "Create Web Service"
3. 等待部署完成（大约1-2分钟）

---

## 🎉 部署成功后

1. 你会获得一个 Render 分配的 URL，例如：`https://qizitang-backend.onrender.com`
2. 把这个 URL 更新到前端的 `frontend/src/api/index.js`
3. 把 `BASE` 改成你的新 URL：
   ```javascript
   const BASE = 'https://你的URL.onrender.com/api'
   ```
4. 重新部署前端到 Vercel

---

## 📝 前端更新步骤

1. 修改 `frontend/src/api/index.js` 里的 `BASE`
2. 提交并推送到 GitHub
3. Vercel 会自动重新部署

---

## 💡 常见问题

### 部署失败？
- 检查是否添加了 `/data` 磁盘
- 检查 Start Command 是否正确
- 查看 Render 的日志

### 前端无法连接？
- 检查前端的 `BASE` 地址是不是你的 Render URL
- 确保地址最后是 `/api`
- 检查 Render 上的服务是否在运行

---

## 🎊 完成！

你的启字堂现在可以在任何地方访问了！
