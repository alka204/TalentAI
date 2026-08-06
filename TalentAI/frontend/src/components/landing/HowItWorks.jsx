import { motion } from 'framer-motion';
import { UploadCloud, SlidersHorizontal, Video, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UploadCloud,
    title: 'Upload your resume',
    description: 'Drop in a PDF. TalentAI extracts your skills, projects, and experience in seconds.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Set up your interview',
    description: 'Choose a role, experience level, duration, and difficulty — the questions adapt to all four.',
  },
  {
    icon: Video,
    title: 'Answer out loud',
    description: 'Your webcam and mic go on. Questions come one at a time, with a timer running.',
  },
  {
    icon: TrendingUp,
    title: 'Get your breakdown',
    description: 'Scores, strengths, mistakes, and a study plan — plus a report you can revisit later.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-container py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="text-sm font-medium text-accent">The process</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Four steps, start to finish</h2>
        <p className="mt-4 text-text-muted">
          No scheduling, no waiting for a human interviewer. Start whenever you're ready.
        </p>
      </motion.div>

      <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Connecting line — desktop only, encodes that this is one continuous flow */}
        <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-border-light to-transparent lg:block" />

        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative flex flex-col items-start"
          >
            <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-border bg-secondary shadow-card">
              <step.icon size={26} className="text-accent" />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-accent font-mono text-xs font-semibold text-white">
                {index + 1}
              </span>
            </div>
            <h3 className="mt-5 font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
