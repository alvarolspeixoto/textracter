import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Textracter",
  description: "App para Disciplina de Computação em Nuvem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        {/* Header fixo no topo */}
        <Header />
        
        {/* Espaço para o conteúdo com margin-top compensando a altura do Header */}
        <main className="bg-[#fff] my-60">
          {children}
        </main>
        
        {/* Footer fixo no rodapé */}
        <Footer />
      </body>
    </html>
  );
}
