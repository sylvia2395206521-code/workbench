const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'workspace.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS 跨域
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Sync-Key');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// 生成或获取设备同步密钥
const SYNC_KEY_FILE = path.join(DATA_DIR, '.synckey');
let serverSyncKey = '';

// 初始化同步密钥
function initSyncKey() {
  if (fs.existsSync(SYNC_KEY_FILE)) {
    serverSyncKey = fs.readFileSync(SYNC_KEY_FILE, 'utf8').trim();
  } else {
    serverSyncKey = crypto.randomBytes(16).toString('hex');
    fs.writeFileSync(SYNC_KEY_FILE, serverSyncKey);
  }
  console.log(`🔑 同步密钥: ${serverSyncKey}`);
}

// ==================== API 路由 ====================

// 获取同步密钥（首次使用时获取）
app.get('/api/key', (req, res) => {
  res.json({ key: serverSyncKey });
});

// 获取数据
app.get('/api/data', (req, res) => {
  const clientKey = req.headers['x-sync-key'];
  if (clientKey && clientKey !== serverSyncKey) {
    return res.status(403).json({ error: '同步密钥不匹配，请重新连接' });
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      res.json({ success: true, data });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (err) {
    console.error('读取数据失败:', err.message);
    // 数据损坏时返回空
    res.json({ success: true, data: null });
  }
});

// 保存数据
app.post('/api/data', (req, res) => {
  const clientKey = req.headers['x-sync-key'];
  if (clientKey && clientKey !== serverSyncKey) {
    return res.status(403).json({ error: '同步密钥不匹配' });
  }

  const body = req.body;
  if (!body || !body.data) {
    return res.status(400).json({ error: '缺少数据' });
  }

  try {
    // 写入文件（原子写入，防止数据损坏）
    const tmpFile = DATA_FILE + '.tmp';
    fs.writeFileSync(tmpFile, JSON.stringify(body.data, null, 2));
    fs.renameSync(tmpFile, DATA_FILE);
    
    console.log(`💾 数据已保存 (${new Date().toLocaleString()})`);
    res.json({
      success: true,
      savedAt: new Date().toISOString(),
      version: body.version || 1
    });
  } catch (err) {
    console.error('保存数据失败:', err.message);
    res.status(500).json({ error: '保存失败' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    dataExists: fs.existsSync(DATA_FILE)
  });
});

// 所有非 API 路由返回 index.html（SPA fallback）
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('应用未部署');
  }
});

// 启动服务
initSyncKey();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`  📋 个人工作台服务器已启动`);
  console.log(`  地址: http://0.0.0.0:${PORT}`);
  console.log(`  密钥: ${serverSyncKey}`);
  console.log(`  数据: ${DATA_FILE}`);
  console.log(`========================================\n`);
});
