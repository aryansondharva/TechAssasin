import { Cpu, Wrench, Zap, CircuitBoard } from "lucide-react";

const features = [
  {
    icon: CircuitBoard,
    title: "RISC-V Dev Kits",
    description: "Get hands-on with cutting-edge RISC-V development boards.",
  },
  {
    icon: Wrench,
    title: "Mentorship",
    description: "Expert hardware mentors to guide your project.",
  },
  {
    icon: Zap,
    title: "Components",
    description: "Free sensors, actuators, and electronic components provided.",
  },
];

const HardwareTrackSection = () => {
  return (
    <section className="py-24 bg-hero text-hero-foreground">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Featured
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <Cpu className="inline-block mr-3 text-primary" size={40} />
            Hardware Track
          </h2>
          <p className="text-hero-muted max-w-lg text-lg">
            Bring your ideas to life with physical hardware. Build IoT devices,
            embedded systems, and robotics projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-hero-foreground/5 border border-hero-foreground/10 rounded-xl p-6 hover:bg-hero-foreground/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-hero-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-hero-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HardwareTrackSection;
