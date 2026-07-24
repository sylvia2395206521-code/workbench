# 个人工作台 - 部署到 Render（免费）

> **预计耗时：10 分钟** | **费用：免费** | **需要：一个邮箱**

---

## 第一步：准备部署包

下载工作台代码包：**`workbench-server.zip`**（在 /workspace/workbench-server.zip）

## 第二步：注册 Render

1. 打开 https://render.com
2. 点击右上角 **"Sign Up"**
3. 选择 **"Sign up with GitHub"**（推荐，最快）
   - 或者用 Google / GitLab 账号
4. 验证邮箱（Render 会发确认邮件）

## 第三步：上传代码到 GitHub

Render 需要从代码仓库部署。有两种方式：

### 方式 A：创建 GitHub 仓库（推荐）

1. 登录 https://github.com
2. 点击右上角 "+" → **"New repository"**
3. 仓库名填 **"workbench"**，选 **Public**
4. 创建后，上传 workbench-server 里的所有文件：
   - 把 `workbench-server.zip` 解压到电脑上
   - 你会看到 `server.js`、`package.json`、`public/` 文件夹
   - 把它们全部上传到 GitHub
5. 或者直接用 GitHub 网页的上传功能（Upload files）

### 方式 B：直接用 Render 的 ZIP 上传（更简单）

1. 在 Render 控制台点击 **"New +"** → **"Web Service"**
2. 拉到最下面，选 **"Deploy from ZIP file"**
3. 选择 `workbench-server.zip` 文件

## 第四步：在 Render 部署

1. 登录 Render 后，点击 **"New +"** → **"Web Service"**
2. 连接你的 GitHub 仓库（选择刚才创建的 `workbench` 仓库）
3. 填写以下信息：

| 字段 | 填写内容 |
|---|---|
| **Name** | `workbench`（任意） |
| **Region** | 选离你最近的，比如 `Singapore` |
| **Branch** | `main` |
| **Runtime** | `Node`（自动识别） |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | **Free**（免费） |

4. 点击 **"Create Web Service"**
5. 等待 3-5 分钟，看到 `Your service is live 🎉` 即可

## 第五步：获取你的同步地址

部署完成后：

1. Render 会给一个地址：`https://workbench.onrender.com`
2. **这就是你的工作台永久地址！**

## 第六步：多设备使用

### 主设备（第一台）

1. 用 **Safari** 打开 `https://workbench.onrender.com`
2. 右上角会自动显示同步密钥（绿色同步图标 → 点击查看）
3. **把这个密钥记下来**

### 其他设备（iPhone / iPad / 电脑）

1. 用 Safari 打开同一个 `https://workbench.onrender.com`
2. 点击顶部的同步图标（🔄）
3. 服务器地址会自动填好
4. 输入主设备上的同步密钥
5. 点击「连接服务器」
6. 数据会自动同步！

### 添加到 iPhone 主屏幕

1. Safari 打开工作台
2. 点底部分享按钮（📤）
3. 选择 **"添加到主屏幕"**
4. 命名 → **"工作台"**
5. 添加完成，像 App 一样用

---

## 注意事项

| 问题 | 说明 |
|---|---|
| **免费版会休眠** | Render 免费服务 15 分钟无访问会休眠。再次访问时需等几秒唤醒，数据不会丢失 |
| **数据备份** | 仍然建议定期点 ⬇️ 导出备份 JSON 文件 |
| **数据安全** | 服务没有用户登录，知道你的地址和密钥的人可以读写数据。链接请勿公开分享 |
| **同步密钥** | 如果忘记了密钥，重新部署后会生成新的 |

## 更新节假日数据

部署后，所有设备打开工作台时，会自动从 Nager.Date API 获取最新节假日数据并缓存。无需额外操作。

---

## 遇到问题？

如果部署过程中遇到任何问题，随时截图发给我，我帮你解决！
