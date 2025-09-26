import { Briefcase, GraduationCap, Users } from "lucide-react";

export default function WhoIsItFor() {
  const features = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Professionals",
      description:
        "Streamline your workflow and extract key information from reports, articles, and presentations. Stay ahead in your field by quickly accessing critical insights.",
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Students",
      description:
        "Enhance your learning by efficiently processing research papers, textbooks, and notes. Grasp complex concepts and accelerate your academic success.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Everyone",
      description:
        "Whether managing personal documents or exploring new topics, Orion provides a user-friendly interface to organize, analyze, and extract valuable knowledge.",
    },
  ];

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="text-foreground">Who is Orion </span>
          <span className="text-primary">Knowledge Hub</span>
          <span className="text-foreground"> for?</span>
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
          Orion Knowledge Hub is designed to empower professionals, students,
          and everyone seeking to unlock insights from documents. Whether you're
          a seasoned expert, a dedicated learner, or simply curious, our
          platform offers the tools to save time, improve productivity, and gain
          deeper understanding.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors"
          >
            <div className="text-primary mb-6 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
