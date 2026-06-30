# GitHub 上传 & 部署指南

## 一、日常上传部署（最常用！）

每次改完代码，打开 **Mac 终端（Terminal）**，输入以下 3 条命令：

```bash
cd ~/Desktop/PERSONAL_WEB_v2
git add .
git commit -m "简单描述你改了什么"
git push
```

**push 完就行了！** 网站会自动更新，等 1-2 分钟即可。

> ⚠️ 若 `git` 报错 `xcode-select: No developer tools were found`，
> 说明 Mac 的命令行工具没装。先运行一次 `xcode-select --install`，
> 在弹窗里点「安装」，装好后再执行上面的命令。

### 举例

```bash
cd ~/Desktop/PERSONAL_WEB_v2
git add .
git commit -m "修复了二级页面图片"
git push
```

---

## 二、部署原理（了解即可）

网站托管在 **腾讯云 EdgeOne Pages**，并绑定了自定义域名。流程：

1. 你 `git push` 把代码推到 GitHub（main 分支）
2. EdgeOne Pages 监听到仓库更新，自动拉取并构建
3. 约 0.5–2 分钟后，线上网站自动更新

**不需要手动操作**，push 就是部署。

---

## 三、你的网站地址

| 用途 | 地址 |
|------|------|
| 线上网站 | https://www.xiaoyunduo.com.cn |
| GitHub 仓库 | https://github.com/RealAliceWang/PERSONAL_WEB |
| 部署平台 | 腾讯云 EdgeOne Pages 控制台 |

> 查看部署是否完成：直接刷新线上网站即可；需要详细构建记录时，登录腾讯云 EdgeOne Pages 控制台查看。

---

## 四、常用命令速查

| 命令 | 作用 |
|------|------|
| `git status` | 查看哪些文件被修改了 |
| `git add .` | 把所有修改加入暂存区 |
| `git commit -m "描述"` | 提交修改，写清楚改了什么 |
| `git push` | 推送到 GitHub（自动触发部署） |
| `git pull` | 从 GitHub 拉取最新代码 |
| `git log --oneline` | 查看提交历史 |

---

## 五、注意事项

1. **顺序不能乱**：先 `add` → 再 `commit` → 最后 `push`
2. commit 信息写清楚改了什么，方便以后回顾
3. 图片等大文件已在 `.gitignore` 中排除，不会被上传
4. 如果在 GitHub 网页上也改了文件，记得先 `git pull` 再改本地代码

---

## 六、项目文件结构

```
PERSONAL_WEB_v2/
├── index.html          ← 首页
├── styles.css          ← 样式
├── script.js           ← 交互脚本
├── assets/             ← 图片、图标等资源
├── works/              ← 作品详情页
└── CNAME               ← 自定义域名配置
```

---

## 七、如果换了新电脑

```bash
git clone git@github.com:RealAliceWang/PERSONAL_WEB.git
```

前提：新电脑需要配置 SSH Key，并安装 Xcode 命令行工具（`xcode-select --install`）。
