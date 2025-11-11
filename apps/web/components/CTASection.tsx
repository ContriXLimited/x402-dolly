import Link from 'next/link';

export function CTASection() {
  return (
    <section className="px-8 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Main CTA Card */}
        <div className="card-dark rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
              Ready to Experience X402?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Start chatting with AI agents using micropayments, or integrate our SDK into your project
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* User CTA */}
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/select"
                  className="gradient-button px-8 py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/50 inline-block"
                >
                  Explore Project Agents →
                </Link>
                <span className="text-gray-500 text-sm">For Users</span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block text-gray-600 text-2xl font-light">
                or
              </div>
              <div className="sm:hidden text-gray-600 text-sm">or</div>

              {/* Project CTA */}
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/floating-chat-demo"
                  className="px-8 py-4 rounded-xl font-bold text-white text-lg border-2 border-purple-500/50 hover:bg-purple-500/10 transition-all hover:scale-105 inline-block"
                >
                  Integrate Our SDK →
                </Link>
                <span className="text-gray-500 text-sm">For Projects</span>
              </div>
            </div>

            {/* Stats or Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">
                    $0.01
                  </div>
                  <div className="text-gray-400 text-sm">Per Query</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">
                    Solana
                  </div>
                  <div className="text-gray-400 text-sm">Powered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">
                    X402
                  </div>
                  <div className="text-gray-400 text-sm">Protocol</div>
                </div>
              </div>
            </div>

            {/* Footer - Powered by AskDolly */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-gray-500 text-sm">
                Powered by{' '}
                <a
                  href="https://askdolly.today/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  AskDolly
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
