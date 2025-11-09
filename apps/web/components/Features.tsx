export function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'Pay Only For What You Use',
      description:
        'No monthly subscriptions. Each AI query costs just 0.01 USDC. Stop paying when you stop using.',
    },
    {
      icon: '🔒',
      title: 'Blockchain-Secured Payments',
      description:
        'All transactions verified on Solana blockchain. Full transparency and immutable payment records.',
    },
    {
      icon: '🚀',
      title: 'Lightning-Fast Responses',
      description:
        "Solana's high-speed blockchain enables instant payment confirmation and immediate AI responses.",
    },
    {
      icon: '🌐',
      title: 'For Users & Projects',
      description:
        'Users chat directly with project agents. Projects embed our SDK to provide paid AI support to their community.',
    },
  ];

  return (
    <section className="px-8 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-white">
            Why Choose X402?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The most efficient way to monetize AI services on blockchain
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-dark p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="text-5xl mb-6">{feature.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-4 text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
