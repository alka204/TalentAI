import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="section-container pb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 text-center sm:px-16"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Your next interview shouldn't be the first time you say it out loud
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-text-muted">
            Run a full mock round today — no scheduling, no waiting, feedback the moment you finish.
          </p>
          <Link to="/signup" className="btn-primary mt-8 px-8 py-3 text-base">
            Start your first interview
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
