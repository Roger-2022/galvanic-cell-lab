#!/bin/bash
# ═══════════════════════════════════════
#  原电池探究平台 — 一键部署到 Vercel
# ═══════════════════════════════════════
#
# 使用方法：
#   1. 打开终端
#   2. cd 到 platform 文件夹
#   3. 运行: bash deploy.sh
#
# 首次运行会自动安装 Vercel CLI 并引导登录
# 部署完成后会显示公网链接，分享给所有人即可

set -e

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║   原电池探究平台 · 一键部署工具       ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 需要安装 Node.js"
    echo "   请前往 https://nodejs.org 下载安装"
    exit 1
fi

# Check/Install Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 正在部署到 Vercel..."
echo ""

# Deploy
vercel --prod

echo ""
echo "  ✅ 部署完成！"
echo "  📋 复制上方显示的链接，发给所有人即可使用"
echo "  💡 所有人打开同一个链接，数据自动同步"
echo ""
