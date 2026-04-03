import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Zap, ArrowRight, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    credits: 5,
    description: 'Perfect for trying out AI video generation',
    features: [
      '5 video generations',
      'Standard quality (576x320)',
      'Basic text prompts',
      'Community support',
      'Watermarked videos',
      'Personal use only',
    ],
    cta: 'Get Started',
    popular: false,
    gradient: 'from-gray-600 to-gray-700',
  },
  {
    name: 'Starter',
    price: '$19',
    period: '/month',
    credits: 100,
    description: 'For creators who need more power',
    features: [
      '100 video generations',
      'HD quality (720p)',
      'AI prompt enhancement',
      'Priority email support',
      'No watermarks',
      'Full commercial license',
      'Image-to-video support',
      'Generation history',
    ],
    cta: 'Start Creating',
    popular: true,
    gradient: 'from-purple-600 to-cyan-500',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    credits: 500,
    description: 'For professionals and teams',
    features: [
      '500 video generations',
      'HD quality (1080p)',
      'AI prompt enhancement',
      '24/7 priority support',
      'No watermarks',
      'Full commercial license',
      'Image-to-video support',
      'Generation history',
      'API access',
      'Custom model fine-tuning',
      'Team collaboration',
    ],
    cta: 'Go Pro',
    popular: false,
    gradient: 'from-yellow-500 to-orange-500',
  },
];

const comparison = [
  { feature: 'Video Generations', free: '5', starter: '100', pro: '500' },
  { feature: 'Video Quality', free: '320p', starter: '720p HD', pro: '1080p HD' },
  { feature: 'AI Prompt Enhancement', free: '✕', starter: '✓', pro: '✓' },
  { feature: 'Image-to-Video', free: '✕', starter: '✓', pro: '✓' },
  { feature: 'Commercial License', free: '✕', starter: '✓', pro: '✓' },
  { feature: 'API Access', free: '✕', starter: '✕', pro: '✓' },
  { feature: 'Support', free: 'Community', starter: 'Priority', pro: '24/7' },
];

export default function PricingPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -top-48 -left-48" />
        <div className="absolute w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl top-1/3 -right-48" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start with 5 free credits. Upgrade anytime to unlock more generations and premium features.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-500/10 to-cyan-500/10 border-2 border-purple-500/30 scale-105'
                  : 'bg-white/[0.02] border border-white/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
              <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-white/5">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">{plan.credits} credits/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/login?signup=true"
                className={`block w-full py-3 rounded-xl text-center font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/25'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-4 font-medium text-gray-300">Feature</th>
                  <th className="text-center p-4 font-medium text-gray-300">Free</th>
                  <th className="text-center p-4 font-medium text-purple-400">Starter</th>
                  <th className="text-center p-4 font-medium text-gray-300">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                    <td className="p-4 text-sm text-gray-300">{row.feature}</td>
                    <td className="p-4 text-sm text-center text-gray-400">{row.free}</td>
                    <td className="p-4 text-sm text-center text-purple-400">{row.starter}</td>
                    <td className="p-4 text-sm text-center text-gray-400">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto mt-20 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
          <p className="text-gray-400 mb-6">
            For enterprise needs or custom requirements, contact us for a tailored solution.
          </p>
          <Link
            to="/login?signup=true"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-medium"
          >
            Contact Sales
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
