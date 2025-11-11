import Image from 'next/image';

export function Hero() {
  return (
    <section className="py-3 px-8 relative overflow-hidden">
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
        {/* Trust Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <span className="text-sm text-gray-300">
            Trusted by <a href="https://askdolly.today/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-semibold">1.5M+ users</a> across 20 Web3 communities
          </span>
        </div>

        {/* Title */}
        <div className="space-y-6">
          <h2 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl text-white leading-tight">
            Get Instant Answers,<br />
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Pay Only What You Use
            </span>
          </h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Tired of waiting hours in Discord for simple answers? Get instant expert responses for just pennies. Powered by X402 protocol.
          </p>
          <p className="text-gray-400 text-lg italic">
            &ldquo;I want this answer now!&rdquo; – No more endless waiting.
          </p>
        </div>
      </div>
    </section>
  );
}
