import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '物流价格计算器 - 快速比较物流费用',
  description: '一站式物流价格比较工具，支持安能、顺心、韵达、极兔等多家物流公司价格查询。输入目的地和重量，即可快速获得最优物流方案。',
  keywords: ['物流价格', '运费计算', '快递费用', '物流比价', '安能快运', '顺心捷达', '韵达快运', '极兔速递'],
  authors: [{ name: '物流价格计算器' }],
  robots: 'index, follow',
  metadataBase: new URL('https://wuliu-calculator.vercel.app'),
  openGraph: {
    title: '物流价格计算器 - 快速比较物流费用',
    description: '一站式物流价格比较工具，帮助您找到最经济的物流方案',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '物流价格计算器',
    description: '快速比较物流费用，找到最优方案',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {/* 页头 */}
          <header className="border-b bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-primary text-center">
                物流价格计算器
              </h1>
              <p className="text-sm text-muted-foreground text-center mt-1">
                快速比较多家物流公司价格，找到最优配送方案
              </p>
            </div>
          </header>

          {/* 主要内容 */}
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>

          {/* 页脚 */}
          <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
            <div className="container mx-auto px-4 py-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  支持物流公司：安能快运、顺心捷达、韵达快运、极兔速递
                </p>
                <p className="text-xs text-muted-foreground">
                  © 2024 物流价格计算器. 数据仅供参考，实际价格以物流公司为准.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
