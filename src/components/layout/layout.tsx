type LayoutProps = {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-[url('/assets/images/bg_fultball.jpg')] bg-cover bg-center dark">
      <header className="bg-gray-900 text-white p-4">
        <h1 className="text-xl">Vai ter jogo</h1>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-gray-900 text-white p-4 text-center">
        © Vai ter jogo 2025
      </footer>
    </div>
  )
}
