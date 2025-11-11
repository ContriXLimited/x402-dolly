export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: '🔗',
      title: 'Connect Your Solana Wallet',
      description:
        'Use Phantom, Backpack, or any Solana wallet. Make sure you have USDC on Solana Devnet.',
      tip: 'Get testnet USDC from Circle Faucet',
    },
    {
      number: '02',
      icon: '🎯',
      title: 'Choose Your Project Agent',
      description:
        'Browse our marketplace of specialized AI agents. Each agent has unique expertise in Web3 domains.',
    },
    {
      number: '03',
      icon: '💬',
      title: 'Chat and Auto-Pay',
      description:
        'Send your message and sign the 0.01 USDC payment. The X402 protocol handles everything seamlessly.',
    },
  ];

  return (
    <section className="px-8 py-20 bg-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-white">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (hidden on mobile, shown on md+) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 opacity-30" />
              )}

              {/* Step Card */}
              <div className="relative card-dark p-8 rounded-2xl">
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-6 mt-4">{step.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {step.description}
                </p>

                {/* Optional Tip */}
                {step.tip && (
                  <p className="text-purple-400 text-xs font-medium">
                    💡 {step.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
