import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-8xl md:text-9xl font-black text-[#FFC700] mb-6 tracking-tight">
          404
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          NOT FOUND
        </h2>
        <p className="text-xl text-neutral-400 mb-12 leading-relaxed">
          Looks like this page doesn&apos;t exist. But there&apos;s plenty of great content waiting for you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
          >
            GO HOME
          </Link>
          <Link
            href="/blog"
            className="bg-transparent border-2 border-[#FFC700] text-[#FFC700] hover:bg-[#FFC700] hover:text-black font-semibold px-8 py-4 rounded-full transition-all duration-300"
          >
            BROWSE POSTS
          </Link>
        </div>
      </div>
    </div>
  );
}
