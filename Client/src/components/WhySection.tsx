import { Lightbulb, Users, GraduationCap, Rocket } from "lucide-react";

const reasons = [
  {
    icon: Lightbulb,
    title: "Learn & Innovate",
    description:
      "Workshops and mentorship sessions to help you grow as a developer and maker.",
  },
  {
    icon: Users,
    title: "Network & Collaborate",
    description:
      "Connect with like-minded peers, industry professionals, and potential co-founders.",
  },
  {
    icon: GraduationCap,
    title: "Win Prizes & Recognition",
    description:
      "Compete for cash prizes, swag, and certificates from top sponsors.",
  },
  {
    icon: Rocket,
    title: "Build Real Projects",
    description:
      "Ship functional prototypes that you can showcase in your portfolio.",
  },
];

const WhySection = () => {
  return (
    <section id="why" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Why Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Why This Hackathon
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            More than just a competition — it's an experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="text-center p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Icon size={26} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
