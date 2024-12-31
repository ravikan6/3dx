import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const handleModelLoad = () => {
    setIsModelLoaded(true);
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden bg-gradient-to-b from-blue-900 to-purple-900">
      {/* Futuristic cityscape background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/placeholder.svg?height=1080&width=1920"
          alt="Futuristic Cityscape"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Spline 3D Model */}
      <div className="absolute inset-0 z-10">
        <Spline
          scene="https://prod.spline.design/rmuc7Hc6W9giusfA/scene.splinecode"
          onLoad={handleModelLoad}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold mb-6 text-center"
        >
          Redefining the Future of 3D Design
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl md:text-2xl mb-12 text-center max-w-2xl"
        >
          Experience cutting-edge 3D-printed products that blend innovation with style.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-blue-500 text-white rounded-full text-xl font-semibold hover:bg-blue-600 transition-colors duration-300"
        >
          Shop Now
        </motion.button>

        <motion.a
          href="#learn-more"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 text-lg underline hover:text-blue-300 transition-colors duration-300"
        >
          Learn About 3D Printing
        </motion.a>
      </div>

      {/* Holographic grid */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="w-full h-full bg-repeat opacity-10"
          style={{
            backgroundImage: "url('/placeholder.svg?height=100&width=100')",
            backgroundSize: '100px 100px',
          }}
        ></div>
      </div>

      {/* Loading overlay */}
      {!isModelLoaded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default Hero;
