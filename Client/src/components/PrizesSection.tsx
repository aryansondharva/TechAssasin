import { Trophy, Award, Medal } from "lucide-react";

const prizes = [
  {
    place: "1st Place",
    amount: "₹2,50,000",
    icon: Trophy,
    highlight: true,
  },
  {
    place: "2nd Place",
    amount: "₹1,50,000",
    icon: Award,
    highlight: false,
  },
  {
    place: "3rd Place",
    amount: "₹1,00,000",
    icon: Medal,
    highlight: false,
  },
];

const PrizesSection = () => {
  return (
    <section id="prizes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Prizes
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            What's Up for Grabs
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Compete for exciting prizes and recognition across multiple tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {prizes.map((prize) => {
            const Icon = prize.icon;
            return (
              <div
                key={prize.place}
                className={`relative rounded-xl p-8 text-center transition-transform hover:-translate-y-1 ${
                  prize.highlight
                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105 md:scale-110"
                    : "bg-card border border-border shadow-sm"
                }`}
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-5 ${
                    prize.highlight
                      ? "bg-primary-foreground/20"
                      : "bg-primary/10"
                  }`}
                >
                  <Icon
                    size={28}
                    className={prize.highlight ? "text-primary-foreground" : "text-primary"}
                  />
                </div>
                <p
                  className={`text-sm font-medium mb-2 ${
                    prize.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {prize.place}
                </p>
                <p className="text-3xl md:text-4xl font-heading font-bold">
                  {prize.amount}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PrizesSection;
