"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  HiOutlineChevronDown,
  HiOutlineQuestionMarkCircle,
  HiOutlineMail,
} from "react-icons/hi";

const faqs = [
  {
    q: "How does paper trading work?",
    a: "Paper trading is a simulated stock market experience. You start with ₹10,00,000 of virtual cash and can buy & sell real Indian NSE stocks at their actual market prices. No real money is involved — it's a risk-free way to learn investing!",
  },
  {
    q: "Is this real money?",
    a: "No! StockSchool uses 100% virtual money. You cannot deposit, withdraw, or lose any real funds. Think of it as a flight simulator for investing.",
  },
  {
    q: "How do I start learning?",
    a: "Head to the Learn section from the navigation bar. We have structured courses starting from 'Stock Market Basics' with lessons, quizzes, and progress tracking. Complete lessons to unlock more advanced topics.",
  },
  {
    q: "What stocks can I trade?",
    a: "You can trade all 2,300+ stocks listed on the National Stock Exchange (NSE) of India. This includes popular ones like TCS, Reliance, HDFC Bank, Infosys, Adani Power, and many more. Search by company name or stock symbol.",
  },
  {
    q: "How are stock prices determined?",
    a: "We fetch real-time market data from Yahoo Finance. The prices you see are actual NSE market prices with a short delay. When you execute a trade, it uses the current market price.",
  },
  {
    q: "Can I reset my portfolio?",
    a: "Yes! Go to Settings → Danger Zone → Reset Portfolio. This will delete all your trades and holdings, and reset your virtual cash back to ₹10,00,000.",
  },
  {
    q: "What is the leaderboard?",
    a: "The leaderboard ranks all StockSchool users by their portfolio performance. It compares total portfolio value (cash + holdings) to see who's the best virtual investor!",
  },
  {
    q: "Is my data safe?",
    a: "Your data is stored securely in our database. We use industry-standard authentication (NextAuth.js) and encrypted connections. We never share your data with third parties.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 px-1 text-left group"
        aria-expanded={open}
      >
        <span className="font-medium text-white/90 group-hover:text-accent transition-colors pr-4">
          {q}
        </span>
        <HiOutlineChevronDown
          className={`text-white/40 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180 text-accent" : ""
          }`}
          size={20}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 px-1 text-sm text-white/60 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("Please write something first");
      return;
    }
    setSending(true);
    // Simulate send (no backend email for now)
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Thanks for your feedback! We'll get back to you.");
    setFeedback("");
    setSending(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Help Center</h1>
          <p className="text-white/50">
            Frequently asked questions and support.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-6 border border-white/10 mb-8"
        >
          <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
            <HiOutlineQuestionMarkCircle className="text-accent" />
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} q={faq.q} a={faq.a} />
            ))}
          </div>
        </motion.div>

        {/* Contact / Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
            <HiOutlineMail className="text-blue-400" />
            Send Feedback
          </h2>
          <p className="text-sm text-white/50 mb-4">
            Have a suggestion or found a bug? Let us know!
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            placeholder="Tell us what you think..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors resize-none mb-4"
          />
          <button
            onClick={handleSendFeedback}
            disabled={sending}
            className="px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Feedback"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
