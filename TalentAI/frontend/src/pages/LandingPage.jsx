import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-container relative overflow-hidden pb-24 pt-20 sm:pt-28">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <span className="glass-card mx-auto mb-6 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-text-muted">
            <Sparkles size={14} className="text-accent" />
            AI-powered mock interviews
          </span>

          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
            Practice interviews with an
            <span className="gradient-text"> AI that talks back</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-text-muted sm:text-lg">
            Upload your resume, pick a role, and run a realistic mock interview —
            then get scored on confidence, communication, and technical depth in real time.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup" className="btn-primary px-8 py-3 text-base">
              Start Free Interview
              <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn-secondary px-8 py-3 text-base">
              See how it works
            </a>
          </div>
        </motion.div>
      </section>

      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  );
}
