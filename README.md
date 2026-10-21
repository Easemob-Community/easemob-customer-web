# easemob-customer-web · 访客聊天端

智能客服系统的 Web 访客端(H5),可嵌入业务网站或独立打开。访客进入后自动分配 AI 客服接待,支持随时转人工、满意度评分。

## 技术栈

Vue 3 + Vite + TypeScript · Pinia · Axios · 环信 Web SDK(easemob-websdk,消息长连接)

## 功能

- 访客免登录进入,自动获取访客身份与环信令牌
- AI 客服自动接待与多轮对话
- 一键转人工 / 关键词触发转人工,排队位置提示
- 满意度评分(会话结束后)
- 消息漫游:断线重连自动接回未结束的会话与聊天记录

## 目录结构

```
src/
├── api/      # 后端接口封装(会话、消息、评分)
├── sdk/      # 环信 IM 连接与消息收发
├── store/    # Pinia 状态(会话、消息列表)
├── views/    # 聊天主界面
└── types/    # TS 类型定义
```

## 本地开发

```bash
npm install
npm run dev        # http://localhost:5173,API 默认代理到 http://localhost:8080
```

## 构建与部署

```bash
npm run build      # 产物在 dist/,按 .env.production 构建
```

关键环境变量(`.env.production`):

| 变量 | 说明 |
|------|------|
| VITE_API_BASE | 后端接口地址,生产环境为同源 `/api`(经 nginx 反代到后端) |
| VITE_EASEMOB_APP_KEY | 环信应用标识 |

构建产物为纯静态文件,交给 nginx 托管即可,示例配置:

```nginx
server {
    listen 80;
    server_name cs.example.com;
    root /opt/easemob-customer/web;
    location /api/ {
        proxy_pass http://127.0.0.1:8082/;
    }
    location / { try_files $uri $uri/ /index.html; }
}
```
