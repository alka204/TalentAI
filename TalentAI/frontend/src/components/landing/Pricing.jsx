import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const plans = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    description: 'Get a feel for the format before you commit.',
    features: ['3 mock interviews / month', '10-minute sessions', 'Basic score breakdown', 'Resume parsing'],
    cta: 'Start free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    cadence: '/ month',
    description: 'For active interview prep — daily practice, full detail.',
    features: [
      'Unlimited mock interviews',
      'Up to 30-minute sessions',
      'Full metric breakdown + live evaluation',
      'Downloadable PDF reports',
      'Full interview history & retakes',
    ],
    cta: 'Start Pro trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$49',
    cadence: '/ month',
    description: 'For bootcamps and career centers coaching groups.',
    features: [
      'Everything in Pro',
      'Up to 10 seats',
      'Cohort progress dashboard',
      'Shared question banks',
      'Priority support',
    ],
    cta: 'Talk to us',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-container py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="text-sm font-medium text-accent">Pricing</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Practice as often as you need to</h2>
        <p className="mt-4 text-text-muted">Cancel anytime. No card required for the free tier.</p>
      </motion.div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-center">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={clsx(
              'relative flex flex-col rounded-2xl border p-8',
              plan.highlighted
                ? 'border-accent/50 bg-card shadow-glow lg:scale-105'
                : 'glass-card border-border'
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-accent px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            )}

            <h3 className="font-semibold">{plan.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-sm text-text-muted">{plan.cadence}</span>
            </div>
            <p className="mt-3 text-sm text-text-muted">{plan.description}</p>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  <span className="text-text-muted">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/signup"
              className={clsx('mt-8 w-full text-center', plan.highlighted ? 'btn-primary' : 'btn-secondary')}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
