import { Code, Cpu, Globe, Palette, Smartphone } from "lucide-react";

const tracks = [
  {
    title: "Web Development",
    description: "Build innovative web applications using modern frameworks and tools.",
    icon: Globe,
  },
  {
    title: "Mobile Apps",
    description: "Create impactful mobile experiences for iOS and Android platforms.",
    icon: Smartphone,
  },
  {
    title: "Hardware Track",
    description: "Tinker with IoT, embedded systems, and physical computing.",
    icon: Cpu,
  },
  {
    title: "AI / ML",
    description: "Leverage machine learning and AI to solve real-world problems.",
    icon: Code,
  },
  {
    title: "Design & UX",
    description: "Craft beautiful, user-centered designs that delight users.",
    icon: Palette,
  },
];

const TracksSection = () => {
  return (
    <section id="tracks" className="py-24 bg-section-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Tracks
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Pick a Track
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose the track that best matches your skills and interests.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.title}
                className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  {track.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {track.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TracksSection;
