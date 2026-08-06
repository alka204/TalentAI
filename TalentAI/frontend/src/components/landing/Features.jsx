import { motion } from 'framer-motion';
import {
  FileSearch,
  Mic,
  Gauge,
  BarChart3,
  FileDown,
  ListChecks,
} from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    title: 'Reads your resume first',
    description:
      'Upload a PDF and TalentAI pulls out your skills, projects, and experience — then builds questions around what you\'ve actually done.',
  },
  {
    icon: ListChecks,
    title: '11 roles, 3 difficulty levels',
    description:
      'From Frontend Developer to Machine Learning Engineer. Pick a role, an experience level, and how hard you want it pushed.',
  },
  {
    icon: Mic,
    title: 'Talks back in real time',
    description:
      'Answer out loud with your mic on. Questions follow up on what you said, the way a real interviewer would.',
  },
  {
    icon: Gauge,
    title: 'Scored while you speak',
    description:
      'Confidence, communication, grammar, technical depth, fluency, and pace — tracked live, not just at the end.',
  },
  {
    icon: BarChart3,
    title: 'Shows you exactly what to fix',
    description:
      'A question-by-question breakdown with concrete strengths, mistakes, and what to study next — no vague scores.',
  },
  {
    icon: FileDown,
    title: 'A report you can keep',
    description:
      'Every session ends with a downloadable PDF report, so you can track progress across weeks, not just one sitting.',
  },
];

export default function Features() {
  return (
    <section id="features" className="section-container py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="text-sm font-medium text-accent">What you get</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Everything a real interview loop throws at you
        </h2>
        <p className="mt-4 text-text-muted">
          Not a quiz. A full simulation — resume-aware questions, a live evaluation,
          and a report you'd actually get from a hiring panel.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="glass-card group p-6 transition-colors hover:border-accent/30"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-gradient-accent group-hover:text-white">
              <feature.icon size={20} />
            </span>
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
