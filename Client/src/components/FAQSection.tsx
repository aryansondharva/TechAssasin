import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Who can participate?",
    answer:
      "Anyone who is passionate about technology! Whether you're a student, professional, or hobbyist — all skill levels are welcome.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "No, participation is completely free. We believe in making hackathons accessible to everyone.",
  },
  {
    question: "Can I participate solo?",
    answer:
      "Yes! You can participate solo or form a team of up to 4 members. We also have a team-matching channel on Discord.",
  },
  {
    question: "What should I bring?",
    answer:
      "For the online round, just your laptop and enthusiasm. For the hardware track, basic tools will be provided at the venue.",
  },
  {
    question: "Will there be mentors?",
    answer:
      "Absolutely! Industry experts and senior developers will be available throughout the event to guide teams.",
  },
  {
    question: "How are projects judged?",
    answer:
      "Projects are evaluated on innovation, technical complexity, design, real-world applicability, and presentation quality.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-section-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Support
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
