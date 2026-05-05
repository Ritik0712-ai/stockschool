import Link from "next/link";
import { HiOutlineMail, HiOutlineChatAlt2 } from "react-icons/hi";

export const metadata = {
  title: "Contact Us — StockSchool",
  description: "Get in touch with the StockSchool team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container-max max-w-3xl text-center">
        <h1 className="text-4xl font-heading font-bold text-white mb-6">Contact Us</h1>
        <p className="text-lg text-white/70 mb-12">
          Have a question or found a bug? We&apos;d love to hear from you.
        </p>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
            <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-4">
              <HiOutlineMail size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
            <p className="text-white/60 mb-4 text-sm">For general inquiries and account help.</p>
            <a href="mailto:support@stockschool.com" className="text-accent hover:text-accent-light font-medium">
              support@stockschool.com
            </a>
          </div>
          
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
              <HiOutlineChatAlt2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Feedback</h3>
            <p className="text-white/60 mb-4 text-sm">Have an idea for a new feature?</p>
            <Link href="/help" className="text-blue-400 hover:text-blue-300 font-medium">
              Visit Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
