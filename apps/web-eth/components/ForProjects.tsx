import Link from 'next/link';

export function ForProjects() {
  return (
    <section className="px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="card-dark rounded-3xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <div className="inline-block px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                For Project Teams
              </div>

              <h2 className="text-4xl font-bold tracking-tight mb-6 text-white">
                Integrate X402 into Your Project
              </h2>

              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Embed our SDK into your website with just a few lines of code.
                Provide paid AI support to your community and monetize every interaction.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl mt-0.5">✓</span>
                  <span className="text-gray-300">
                    <strong className="text-white">Easy Integration</strong> -
                    Drop-in React component
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl mt-0.5">✓</span>
                  <span className="text-gray-300">
                    <strong className="text-white">Customizable UI</strong> -
                    Match your brand identity
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl mt-0.5">✓</span>
                  <span className="text-gray-300">
                    <strong className="text-white">Built-in Payments</strong> -
                    X402 protocol handles everything
                  </span>
                </li>
              </ul>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/floating-chat-demo"
                  className="gradient-button px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105"
                >
                  View Live Demo
                </Link>
                <a
                  href="https://github.com/yourusername/dolly-x402-sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-all"
                >
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Right: Code Example */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl" />

              <div className="relative bg-[#1a1a1a] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-gray-500 text-xs">app/page.tsx</span>
                </div>

                <pre className="text-sm overflow-x-auto">
                  <code className="text-gray-300">
{`import { FloatingChat } from '@askdolly/x402-embed-sdk';

export default function MyPage() {
  return (
    <>
      {/* Your page content */}

      <FloatingChat
        agentId="1"
        agentName="Your Project Agent"
        agentDescription="Ask me anything"
        position="bottom-right"
        logoUrl="/logo.svg"
      />
    </>
  );
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
