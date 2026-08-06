import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const faqs = [
  {
    question: 'Do I need to upload a resume to start?',
    answer:
      "No. You can pick a role and go straight into a mock interview. A resume just lets TalentAI tailor a few questions to your actual projects and skills.",
  },
  {
    question: 'What roles are supported?',
    answer:
      'Software Engineer, Frontend, Backend, Full Stack, Data Analyst, Data Scientist, Product Manager, UI/UX Designer, Cyber Security, DevOps, and Machine Learning — with more added over time.',
  },
  {
    question: 'How is my answer actually scored?',
    answer:
      'Your spoken answer is transcribed and evaluated across confidence, communication, grammar, technical knowledge, fluency, keyword match, and pace, then combined into an overall score with question-by-question notes.',
  },
  {
    question: 'Can I retake an interview?',
    answer:
      'Yes — every session is saved to your history, and you can retake the same setup as many times as you want to track improvement over time.',
  },
  {
    question: 'Is my resume or interview data shared anywhere?',
    answer:
      "No. Your resume, transcripts, and reports are private to your account and are never shared or used to train models without your consent.",
  },
  {
    question: 'Can I cancel a paid plan anytime?',
    answer:
      "Yes, cancel from your profile settings whenever you like — you'll keep access through the end of your current billing period.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{faq.question}</span>
        <ChevronDown
          size={18}
          className={clsx('shrink-0 text-text-muted transition-transform duration-200', isOpen && 'rotate-180 text-accent')}
        />
      </button>

      <div
        className={clsx(
          'grid transition-all duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-text-muted">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-container py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="text-sm font-medium text-accent">FAQ</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Questions people ask before starting</h2>
      </motion.div>

      <div className="mx-auto mt-12 max-w-2xl space-y-3">
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.question}
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </section>
  );
}
