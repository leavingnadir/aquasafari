import { useState, useMemo } from "react";
import { FAQS } from "../data/homeContent";
import { Search, HelpCircle, ChevronDown, MessageSquare, LifeBuoy, ShieldCheck } from "lucide-react";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  // Filter FAQs based on user search query
  const filteredFaqs = useMemo(() => {
    return FAQS.filter(
      (faq) =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-surface-955 text-content-primary pt-28 pb-20 px-4 font-body">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Search Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400 mb-4 border border-brand-500/20">
            <HelpCircle size={14} />
            Support & Resources
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            How can we help you?
          </h1>
          <p className="text-content-secondary text-base mb-8">
            Search our knowledge base for answers regarding bookings, safety guidelines, cancellations, and more.
          </p>

          {/* Search Bar Input */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., cancellation, payment, children)..."
              className="w-full rounded-2xl border border-surface-800 bg-surface-900 py-4 pl-12 pr-4 text-sm text-content-primary placeholder-content-muted shadow-lg outline-none transition-all focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Support Categories Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <div className="rounded-2xl border border-surface-800 bg-surface-900 p-6 flex flex-col items-center text-center shadow-md">
            <div className="rounded-xl bg-brand-500/10 p-3 text-brand-400 mb-4 border border-brand-500/20">
              <LifeBuoy size={24} />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">Booking Guide</h3>
            <p className="text-xs text-content-secondary">Learn how to search, reserve, and manage your safari sessions.</p>
          </div>

          <div className="rounded-2xl border border-surface-800 bg-surface-900 p-6 flex flex-col items-center text-center shadow-md">
            <div className="rounded-xl bg-brand-500/10 p-3 text-brand-400 mb-4 border border-brand-500/20">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">Safety & Policies</h3>
            <p className="text-xs text-content-secondary">Read up on our weather guarantees and safety protocols.</p>
          </div>

          <div className="rounded-2xl border border-surface-800 bg-surface-900 p-6 flex flex-col items-center text-center shadow-md">
            <div className="rounded-xl bg-brand-500/10 p-3 text-brand-400 mb-4 border border-brand-500/20">
              <MessageSquare size={24} />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">Live Assistance</h3>
            <p className="text-xs text-content-secondary">Our skippers and support staff are available around the clock.</p>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-xl">
          <h2 className="font-display text-2xl font-bold mb-6 tracking-tight">Frequently Asked Questions</h2>

          {filteredFaqs.length === 0 ? (
            <p className="text-content-muted text-center py-8">No matching help topics found for &ldquo;{searchQuery}&rdquo;.</p>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div 
                    key={index} 
                    className="overflow-hidden rounded-2xl border border-surface-800 bg-surface-950 transition-colors"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="flex w-full items-center justify-between p-5 text-left font-display font-medium text-content-primary transition-colors hover:text-brand-400"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown 
                        size={18} 
                        className={`text-content-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-400" : ""}`} 
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-content-secondary border-t border-surface-900/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
