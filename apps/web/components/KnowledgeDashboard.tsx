export function KnowledgeDashboard() {
  return (
    <section className="px-8 py-20 bg-linear-to-b from-transparent to-purple-900/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            Building the Future
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-6 text-white">
            Micro-Knowledge Marketplace
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            We're not just building a service - we're creating the future where every piece of knowledge becomes a plugin on your website.
            Turn your expertise into earning agents and let different parties pay-as-they-go for direct, exact answers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Step 1 */}
          <div className="card-dark p-8 rounded-2xl">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3 text-white">1. Knowledge Dashboard</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Upload your data - documents, chat history, websites, API data.
              Our system auto-generates custom agents in minutes.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-dark p-8 rounded-2xl">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3 text-white">2. Agent Marketplace</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover and use professional agents. Chat2Earn model ensures creators earn
              with every conversation while users get instant expert answers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-dark p-8 rounded-2xl">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3 text-white">3. X402 SDK</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              One line of code to embed payment-enabled AI anywhere.
              Your knowledge pool becomes a plugin on your website instantly.
            </p>
          </div>
        </div>

        {/* Dashboard Screenshot */}
        <div className="card-dark rounded-2xl p-6 border border-white/10 overflow-hidden">
          <div className="relative">
            <img
              src="/dashboard.png"
              alt="Knowledge Dashboard - Upload data and create earning agents"
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm max-w-2xl mx-auto mb-4">
              Turn your data into earning agents in minutes - no coding required.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Drag & Drop Upload</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>AI Auto-Configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>One-Click Deploy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Use Case Example */}
        <div className="mt-12 p-8 bg-linear-to-r from-purple-900/20 to-pink-900/20 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold mb-4 text-white">Real-World Example</h3>
          <p className="text-gray-300 leading-relaxed">
            Instead of paying $20/month for RootData just to get 1-2 pieces of information,
            users now pay only for what they need. Communities offer instant answers through
            embedded agents, eliminating the frustrating journey of visiting websites,
            searching for Discord links, joining servers, posting questions, and waiting for replies.
          </p>
          <p className="text-purple-400 mt-4 italic">
            "I want this answer now!" - That's exactly what we deliver.
          </p>
        </div>
      </div>
    </section>
  );
}
