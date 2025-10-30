import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#18181B] p-10 text-white">
      
      {/* Logo/Título Principal (com classes corrigidas) */}
      <div className="mb-16 text-center">
        <h1 
          className="text-7xl italic font-serif text-white" 
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          CAPONE
        </h1>
        <p className="text-xl text-gray-400 tracking-wider">
          Adega & Empório
        </p>
      </div>

      {/* Container das Opções */}
      <div className="flex flex-col sm:flex-row gap-8">

        {/* --- Opção 1: Sou Cliente (Estilo atualizado) --- */}
        <Link
          href="/clients/login-clientes"
          className="relative w-72 cursor-pointer rounded-sm border-2 border-white bg-transparent px-8 py-5 text-center font-bold uppercase text-white transition-all duration-300 hover:border-red-600 hover:text-red-600 active:border-red-600 active:text-red-600"
        >
          <span className="relative z-10">
            Sou Cliente
          </span>
          {/* O <span> de efeito foi removido */}
        </Link>

        {/* --- Opção 2: Minha Loja (Estilo atualizado) --- */}
        <Link
          href="/admin/login-funcionarios"
          className="relative w-72 cursor-pointer rounded-sm border-2 border-white bg-transparent px-8 py-5 text-center font-bold uppercase text-white transition-all duration-300 hover:border-red-600 hover:text-red-600 active:border-red-600 active:text-red-600"
        >
          <span className="relative z-10">
            Minha Loja
          </span>
          {/* O <span> de efeito foi removido */}
        </Link>

      </div>
    </main>
  );
}