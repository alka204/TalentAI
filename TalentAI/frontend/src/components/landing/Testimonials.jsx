import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Nair',
    role: 'Frontend Developer, switching to Full Stack',
    initials: 'PN',
    quote:
      "The resume-aware questions caught me off guard in a good way — it asked about a caching bug from a project I'd almost forgotten I mentioned.",
  },
  {
    name: 'Marcus Webb',
    role: 'New grad, Software Engineer track',
    initials: 'MW',
    quote:
      'I\'d never actually heard myself answer a system design question out loud before this. The pacing feedback alone was worth it.',
  },
  {
    name: 'Ana Costa',
    role: 'Product Manager, 4 YOE',
    initials: 'AC',
    quote:
      'Ran three mock rounds before a real one this month. The report showing my "communication" score creeping up each time kept me practicing.',
  },
];

export default function Testimonials() {
  return (
    <section className="section-container py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="text-sm font-medium text-accent">From the practice room</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">People who ran the drill</h2>
      </motion.div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, index) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="glass-card flex flex-col p-6"
          >
            <Quote size={22} className="text-accent/50" />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-text">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-accent font-display text-sm font-semibold text-white">
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-text-muted">{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
