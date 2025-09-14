import React from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Footer } from "../components/common/Footer";

// --- Icon Components (inlined to avoid extra dependencies) ---
const MailIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ZapIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ShieldCheckIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const BarChartIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </svg>
);

// --- Feature Data ---
const features = [
  {
    icon: <MailIcon className="w-8 h-8 text-indigo-500" />,
    title: "Smart Email Summarization",
    description:
      "Get the gist of long emails in seconds. Our AI extracts key points, so you can focus on what matters.",
  },
  {
    icon: <ZapIcon className="w-8 h-8 text-indigo-500" />,
    title: "AI-powered Reply Suggestions",
    description:
      "Draft perfect replies instantly. Choose from context-aware suggestions to speed up your communication.",
  },
  {
    icon: <ShieldCheckIcon className="w-8 h-8 text-indigo-500" />,
    title: "Intelligent Filtering",
    description:
      "Automatically sort important, private, and promotional emails with advanced, secure filters.",
  },
  {
    icon: <BarChartIcon className="w-8 h-8 text-indigo-500" />,
    title: "Inbox Activity Analytics",
    description:
      "Understand your email habits with beautiful, insightful charts and data visualizations.",
  },
];

// --- Main Landing Page Component ---
const LandingPage = () => {
  // --- Particle Background Initialization ---
  const particlesInit = React.useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "#f9fafb", // Light gray background
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 1,
          },
        },
      },
    },
    particles: {
      color: {
        value: "#4f46e5", // Indigo color for particles
      },
      links: {
        color: "#a5b4fc", // Lighter indigo for links
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  // --- Animation Variants for Framer Motion ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // NOTE: To use this component, you'll need to install the following packages:
  // npm install react-tsparticles tsparticles-slim framer-motion

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased relative overflow-hidden">
      {/* Animated Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold tracking-wider text-gray-900"
            >
              MailFlare
            </motion.div>
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg font-semibold shadow-md hover:bg-gray-100 border border-gray-200 transition-colors duration-300"
              onClick={() => {
                
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                alt="Google Logo"
                className="w-5 h-5"
              />
              Login with Google
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
          {/* Hero Section */}
          <motion.section
            className="container mx-auto flex flex-col items-center space-y-8 py-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-gray-900"
            >
              Reclaim Your Inbox.
              <br />
              Experience{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Intelligent Email
              </span>
              .
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-2xl text-lg md:text-xl text-gray-600"
            >
              MailFlare uses cutting-edge AI to clean up your inbox, write
              replies for you, and give you back hours of your day.
            </motion.p>

            <motion.div variants={itemVariants}>
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105">
                Get Started for Free
              </button>
            </motion.div>
          </motion.section>

          {/* Features Section */}
          <motion.section
            id="features"
            className="w-full py-20 bg-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Why You'll Love MailFlare
              </h2>
              <p className="text-gray-500 mb-12 max-w-xl mx-auto">
                Everything you need to be more productive and less stressed
                about your email.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="p-8 bg-white border border-gray-100 rounded-xl shadow-lg text-left flex flex-col items-start"
                    variants={itemVariants}
                  >
                    <div className="p-3 bg-indigo-100 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
