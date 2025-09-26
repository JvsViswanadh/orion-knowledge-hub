export default function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Amelia Harper",
      role: "Researcher",
      content: "Orion has revolutionized my research process. I can now extract key insights from complex documents in minutes, saving me hours of work.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Ethan Bennett", 
      role: "University Student",
      content: "As a student, Orion has been invaluable. It helps me quickly understand and summarize large volumes of information, making studying much more efficient.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Sophia Carter",
      role: "Project Manager", 
      content: "I use Orion for both professional and personal projects. It's an incredibly versatile tool that helps me stay organized and informed.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="text-foreground">What Our </span>
          <span className="text-primary">Users</span>
          <span className="text-foreground"> Say</span>
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          Hear from our users about how Orion Knowledge Hub has transformed their approach to 
          knowledge management.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors"
          >
            {/* User Info */}
            <div className="flex items-center mb-4">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
            
            {/* Testimonial Content */}
            <p className="text-muted-foreground leading-relaxed italic">
              "{testimonial.content}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
