const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;
const VERSION_DIR = path.join(__dirname, 'versions');
const VERSION_FILE = path.join(VERSION_DIR, 'versions.json');

app.use(express.json());
app.use(express.static(__dirname));

// 确保版本目录存在
if (!fs.existsSync(VERSION_DIR)) {
    fs.mkdirSync(VERSION_DIR, { recursive: true });
}

// 读取版本列表
function readVersions() {
    try {
        if (!fs.existsSync(VERSION_FILE)) {
            return [];
        }
        const data = fs.readFileSync(VERSION_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取版本列表失败:', error);
        return [];
    }
}

// 保存版本列表
function saveVersions(versions) {
    try {
        fs.writeFileSync(VERSION_FILE, JSON.stringify(versions, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('保存版本列表失败:', error);
        return false;
    }
}

// 创建备份
app.post('/api/backup', (req, res) => {
    const { description } = req.body;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const version = `v_${timestamp}`;
    const backupDir = path.join(VERSION_DIR, version);

    try {
        // 创建备份目录
        fs.mkdirSync(backupDir, { recursive: true });

        // 复制文件
        const filesToBackup = ['*.html', '*.css', '*.js'];
        filesToBackup.forEach(pattern => {
            const files = fs.readdirSync(__dirname).filter(file => {
                return pattern === '*.html' ? file.endsWith('.html') :
                       pattern === '*.css' ? file.endsWith('.css') :
                       file.endsWith('.js');
            });
            files.forEach(file => {
                fs.copyFileSync(path.join(__dirname, file), path.join(backupDir, file));
            });
        });

        // 复制assets目录
        const assetsDir = path.join(__dirname, 'assets');
        if (fs.existsSync(assetsDir)) {
            copyDirectory(assetsDir, path.join(backupDir, 'assets'));
        }

        // 更新版本列表
        const versions = readVersions();
        const newVersion = {
            version,
            description: description || '自动备份',
            date: new Date().toLocaleString('zh-CN')
        };
        versions.push(newVersion);
        saveVersions(versions);

        res.json({ success: true, version, date: newVersion.date });
    } catch (error) {
        console.error('备份失败:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 恢复版本
app.post('/api/restore', (req, res) => {
    const { version } = req.body;
    const backupDir = path.join(VERSION_DIR, version);

    if (!fs.existsSync(backupDir)) {
        return res.status(404).json({ success: false, error: '版本不存在' });
    }

    try {
        // 恢复文件
        const files = fs.readdirSync(backupDir);
        files.forEach(file => {
            const srcPath = path.join(backupDir, file);
            const destPath = path.join(__dirname, file);
            
            if (fs.statSync(srcPath).isDirectory()) {
                // 如果是目录，递归复制
                copyDirectory(srcPath, destPath);
            } else {
                // 如果是文件，直接复制
                fs.copyFileSync(srcPath, destPath);
            }
        });

        res.json({ success: true, version });
    } catch (error) {
        console.error('恢复失败:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 删除版本
app.post('/api/delete', (req, res) => {
    const { version } = req.body;
    const backupDir = path.join(VERSION_DIR, version);

    if (!fs.existsSync(backupDir)) {
        return res.status(404).json({ success: false, error: '版本不存在' });
    }

    try {
        // 删除备份目录
        fs.rmSync(backupDir, { recursive: true, force: true });

        // 更新版本列表
        const versions = readVersions().filter(v => v.version !== version);
        saveVersions(versions);

        res.json({ success: true, version });
    } catch (error) {
        console.error('删除失败:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取版本列表
app.get('/api/versions', (req, res) => {
    try {
        const versions = readVersions();
        res.json(versions);
    } catch (error) {
        console.error('获取版本列表失败:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 辅助函数：递归复制目录
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

app.listen(PORT, () => {
    console.log(`版本管理服务器运行在 http://localhost:${PORT}`);
    console.log(`版本管理界面: http://localhost:${PORT}/version-manager.html`);
});