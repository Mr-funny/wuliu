# 物流价格计算器

## 项目概述

物流价格计算器是一个面向电商领域的工具，帮助用户快速计算和比较不同物流公司的配送费用。用户只需输入目的地地址和包裹重量，系统将自动计算并展示多家物流公司的价格，帮助用户选择最经济实惠的物流方案。

## 数据文件说明

本项目包含以下物流公司的价格数据文件（JSON格式）：

- `data/annengbz.json` - 安能物流标准价格表
- `data/annengdsd.json` - 安能物流大客户价格表
- `data/jym.json` - 极兔物流价格表
- `data/shunxin.json` - 顺心物流价格表
- `data/yunda.json` - 韵达物流价格表
- `data/pricing_data.json` - 包含以上所有物流公司价格的合并文件

原始CSV数据已通过 `scripts/convert_csv_to_json.py` 脚本转换为JSON格式。

## 计费规则说明

各物流公司的计费规则已结构化为JSON格式，包含以下字段：

- `company`: 物流公司名称
- `pricing`: 定价规则数组
  - `destination`: 目的地
  - `base_weight_kg`: 首重重量（公斤）
  - `base_price`: 首重价格
  - `extra_weight_tiers`: 续重价格梯度数组
    - `min_weight`: 续重区间的最小重量
    - `max_weight`: 续重区间的最大重量
    - `price_per_kg`: 该区间的每公斤单价

## 技术实现

本项目计划使用以下技术栈实现：

- 前端：Next.js 14 + TypeScript + Tailwind CSS + Shadcn-ui
- 数据管理：CSV/JSON 数据解析
- 部署：Vercel

## 开发计划

1. 基础计算功能开发
2. 增强功能和用户体验优化
3. 测试、优化和发布

## 项目文档

- [产品需求文档(PRD)](./prd.md) - 详细的产品需求说明

## 如何开始

待项目开发完成后补充
