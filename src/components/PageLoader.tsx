import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 0, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16"
        >
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="black"/>
            <path d="M9 23V9H14.5C16.5 9 18.0833 9.5 19.25 10.5C20.4167 11.5 21 12.8333 21 14.5C21 15.5 20.7083 16.3958 20.125 17.1875C19.5417 17.9792 18.7083 18.5833 17.625 19L21 23H17.375L14.625 19.75C14.2917 19.1667 13.9583 18.7708 13.625 18.5625C13.2917 18.3542 12.875 18.25 12.375 18.25H12.5V23H9Z M12.5 15.75H14.5C15.3333 15.75 15.9583 15.5417 16.375 15.125C16.7917 14.7083 17 14.1667 17 13.5C17 12.8333 16.7917 12.2917 16.375 11.875C15.9583 11.4583 15.3333 11.25 14.5 11.25H12.5V15.75Z" fill="white"/>
          </svg>
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default PageLoader;