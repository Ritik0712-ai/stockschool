"use client";

import { motion } from "framer-motion";
import { HiStar } from "react-icons/hi";

/**
 * Social proof section with:
 * - Headline with user count
 * - 3 testimonial cards with avatar, name, location, quote, rating
 * - Gradient background with subtle pattern
 */

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya",
    color: "from-pink-400 to-rose-500",
    quote:
      "I was always scared of the stock market. StockSchool made it so simple — I completed my first SIP within 2 weeks of joining!",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    location: "Ahmedabad, Gujarat",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Arjun",
    color: "from-blue-400 to-indigo-500",
    quote:
      "The paper trading simulator is genius. I practiced for a month before putting in real money. Now my portfolio is up 18% in 6 months.",
    rating: 5,
  },
  {
    name: "Sneha Reddy",
    location: "Hyderabad, Telangana",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sneha",
    color: "from-accent to-teal-500",
    quote:
      "Finally, a platform that doesn't assume I know what a 'bull market' is. The step-by-step learning path is exactly what I needed.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function SocialProof() {
  return (
    <section
      className="section-padding bg-gradient-to-br from-surface to-surface-muted relative overflow-hidden"
      id="social-proof"
    >
      {/* Decorative blur blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container-max relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Trusted by Beginners
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
            Join our{" "}
            <span className="text-accent">early beta</span> community
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            Real stories from real people who started their investing journey
            with StockSchool.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="glass rounded-2xl p-6 sm:p-8 shadow-sm border border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <HiStar key={i} className="text-amber-400" size={18} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar with image */}
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center overflow-hidden`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">
                    {t.name}
                  </p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { value: "Beta", label: "Status" },
            { value: "10+", label: "Lessons" },
            { value: "₹10L", label: "Virtual Cash" },
            { value: "100%", label: "Free Forever" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center py-4 px-2 rounded-xl bg-white/5 border border-white/10"
            >
              <p className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
