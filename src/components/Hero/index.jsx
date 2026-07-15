import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Hero = ({ 
  title = "Welcome to Stay Haven", 
  subtitle = "Experience the perfect blend of luxury, comfort, and style." 
}) => {
  return (
    <div className="relative h-[80vh] flex items-center justify-center bg-cover bg-center overflow-hidden" 
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')" }}>
      
      {/* Exact Figma-like Dark Overlay */}
      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <Title 
          className="!text-white !text-5xl md:!text-7xl !font-bold !mb-6 drop-shadow-2xl font-serif"
        >
          {title}
        </Title>
        <Paragraph 
          className="text-white text-lg md:text-2xl font-light drop-shadow-md opacity-90 italic"
        >
          {subtitle}
        </Paragraph>
        
        {/* Figma Decoration Line */}
        <div className="w-24 h-1 bg-blue-500 mx-auto mt-8 rounded-full shadow-lg"></div>
      </div>
    </div>
  );
};

export default Hero;