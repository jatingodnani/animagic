
import React, { useState, useEffect } from 'react';

interface CounterProps {
  end: number;
  duration: number;
  suffix?: string;
  prefix?: string;
}

const Counter = ({ end, duration, suffix = '', prefix = '' }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, isVisible]);

  return (
    <div ref={counterRef} className="text-center">
      <div className="text-4xl font-bold text-animation-purple mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
    </div>
  );
};

const StatsCounter = () => {
  const stats = [
    {
      title: "Happy Users",
      value: 5000,
      suffix: "+",
      icon: "👥",
    },
    {
      title: "Animations Created",
      value: 25000,
      suffix: "+",
      icon: "🎬",
    },
    {
      title: "Hours Saved",
      value: 12000,
      suffix: "+",
      icon: "⏱️",
    },
    {
      title: "Success Rate",
      value: 98,
      suffix: "%",
      icon: "🏆",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:scale-125 transition-all duration-300 text-center">
                {stat.icon}
              </div>
              <Counter
                end={stat.value}
                duration={2000}
                suffix={stat.suffix}
              />
              <p className="text-animation-gray-500 text-center">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
