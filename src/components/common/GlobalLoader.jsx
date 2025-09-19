import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCount, subscribe } from '../../utils/loadingBus';

const GlobalLoader = () => {
  const [count, setCount] = useState(getCount());
  const visible = count > 0;

  useEffect(() => {
    const unsub = subscribe(setCount);
    return () => unsub();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
