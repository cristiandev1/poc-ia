import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Impact Metrics Dashboard',
  description: 'Visualização de métricas de impacto da IA na produtividade',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
