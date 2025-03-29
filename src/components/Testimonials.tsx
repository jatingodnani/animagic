
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

const Testimonial = ({ quote, author, role, rating }: TestimonialProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="pt-6 pb-4 h-full flex flex-col">
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-animation-gray-500 italic flex-1 mb-4">"{quote}"</p>
        <div className="mt-auto">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-animation-gray-400">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "AniMagic transformed our marketing videos into eye-catching animations that increased engagement by 45%.",
      author: "Alex Johnson",
      role: "Marketing Director",
      rating: 5
    },
    {
      quote: "The intuitive interface made it easy to create professional animations without any prior experience.",
      author: "Sarah Chen",
      role: "Content Creator",
      rating: 4
    },
    {
      quote: "I've tried many animation tools, but none are as fast and efficient as AniMagic for quick video transformations.",
      author: "Michael Wong",
      role: "Social Media Manager",
      rating: 5
    }
  ];

  return (
    <section className="py-16 px-4 bg-animation-gray-100">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4 animate-fade-in">What Users Say</h2>
          <p className="text-animation-gray-500 max-w-2xl mx-auto animate-fade-in">
            Don't just take our word for it. Here's what people are saying about AniMagic.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="transform transition-all duration-500"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Testimonial {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
