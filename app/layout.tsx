import type { Metadata } from 'next';
export const metadata:Metadata={title:'Tiệm — Quản lý lịch & vận hành',description:'Không gian quản lý cho nail, mi, salon và spa.',icons:{icon:'/icon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body>{children}</body></html>}
