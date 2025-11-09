import Image from 'next/image';

export function Hero() {
  return (
    <section className="py-22 px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/decoration.webp"
          alt=""
          width={800}
          height={800}
          className="object-contain"
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center relative z-10">
        {/* Title */}
        <div className="space-y-6">
          <h2 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl text-white leading-tight">
            Project Intelligence,<br />
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Penny Per Query
            </span>
          </h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Pay-as-you-go project insights with minimal cost. Powered by x402 protocol
          </p>
        </div>
      </div>
    </section>
  );
}
