# GitHub 上传 & 部署指南

## 一、日常上传部署（最常用！）

每次改完代码，打开 **Mac 终端（Terminal）**，输入以下 3 条命令：

```bash
cd ~/Desktop/PERSONAL_WEB
git add .
git commit -m "简单描述你改了什么"
git push
```

**push 完就行了！** 网站会自动更新部署，等 1-2 分钟即可。

### 举例

```bash
cd ~/Desktop/PERSONAL_WEB
git add .
git commit -m "修复了二级页面图片"
git push
```

---

## 二、部署原理（了解即可）

你的项目已配置好 **GitHub Actions** 自动部署：

1. 你 `git push` 代码到 GitHub
2. GitHub 检测到 main 分支有更新，自动触发部署
3. 1-2 分钟后网站自动更新

**不需要装任何额外工具**，push 就是部署。

---

## 三、如何查看部署状态

打开浏览器访问：

👉 https://github.com/RealAliceWang/PERSONAL_WEB/actions

- 绿色 ✅ = 部署成功
- 黄色 🟡 = 正在部署
- 红色 ❌ = 部署失败（点进去看原因）

---

## 四、你的网站地址

| 用途 | 地址 |
|------|------|
| 线上网站 | https://realalicewang.github.io/PERSONAL_WEB/ |
| GitHub 仓库 | https://github.com/RealAliceWang/PERSONAL_WEB |
| 部署状态 | https://github.com/RealAliceWang/PERSONAL_WEB/actions |

---

## 五、常用命令速查

| 命令 | 作用 |
|------|------|
| `git status` | 查看哪些文件被修改了 |
| `git add .` | 把所有修改加入暂存区 |
| `git commit -m "描述"` | 提交修改，写清楚改了什么 |
| `git push` | 推送到 GitHub（自动触发部署） |
| `git pull` | 从 GitHub 拉取最新代码 |
| `git log --oneline` | 查看提交历史 |

---

## 六、注意事项

1. **顺序不能乱**：先 `add` → 再 `commit` → 最后 `push`
2. commit 信息写清楚改了什么，方便以后回顾
3. 图片等大文件已在 `.gitignore` 中排除，不会被上传
4. 如果在 GitHub 网页上也改了文件，记得先 `git pull` 再改本地代码

---

## 七、项目文件结构

```
PERSONAL_WEB/
├── index.html          ← 首页
├── assets/
│   ├── 1.jpg ~ 9.jpg   ← 作品图片
│   ├── hero-bg.png      ← 首页背景
│   └── section-bg.png   ← 板块背景
├── works/
│   ├── 1.html ~ 9.html  ← 作品详情页（编号与图片对应）
└── .github/workflows/
    └── static.yml       ← 自动部署配置（不要改）
```

新增作品时，按编号递增（如 `9.jpg` + `9.html`）。

---

## 八、如果换了新电脑

```bash
git clone git@github.com:RealAliceWang/PERSONAL_WEB.git
```

前提：新电脑需要配置 SSH Key（参考之前的步骤）。
