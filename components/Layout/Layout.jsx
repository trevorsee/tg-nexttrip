import { motion } from "framer-motion";

export const Layout = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={{
        hidden: { opacity: 0, x: 300 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: -300 },
      }}
      transition={{ type: "linear" }}
      className="flex flex-col items-center justify-center min-h-screen py-2 pt-24"
    >
      {children}
    </motion.div>
  );
};

export default Layout;
