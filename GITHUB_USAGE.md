# GitHub 新手使用指南

## 日常使用（最常用！）

每次修改了代码，想同步到 GitHub，在 **Mac 终端（Terminal）** 里执行：

```bash
cd ~/Desktop/PERSONAL_WEB
git add .
git commit -m "简单描述你改了什么"
git push
```

### 举例

```bash
git add .
git commit -m "更新了首页样式"
git push
```

---

## 常用命令速查

| 命令 | 作用 |
|------|------|
| `git status` | 查看哪些文件被修改了 |
| `git add .` | 把所有修改的文件加入暂存区 |
| `git commit -m "描述"` | 提交修改，写清楚改了什么 |
| `git push` | 推送到 GitHub |
| `git pull` | 从 GitHub 拉取最新代码 |
| `git log --oneline` | 查看提交历史 |

---

## 注意事项

1. **先 add → 再 commit → 最后 push**，顺序不能乱
2. commit 信息写清楚改了什么，方便以后回顾
3. 图片等大文件已在 `.gitignore` 中排除，不会被上传
4. 如果在 GitHub 网页上也改了文件，记得先 `git pull` 再改代码

---

## 你的仓库地址

https://github.com/RealAliceWang/PERSONAL_WEB

---

## 如果换了新电脑，怎么把代码拉下来

```bash
git clone git@github.com:RealAliceWang/PERSONAL_WEB.git
```

（前提：新电脑也要配置 SSH Key，参考之前的步骤）
