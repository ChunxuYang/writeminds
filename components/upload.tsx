"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { useSupportContext } from "~/providers/support-provider";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export default function Upload() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { files, uploadFile } = useSupportContext();

  return (
    <div className="w-full mx-auto md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-24 fixed bottom-0 self-center">
      <motion.button
        className="mx-10 p-5 z-30 bg-indigo-500 relative shadow-xl"
        animate={{
          // className: "w-64 h-64 bg-blue-500 rounded-lg mx-10 p-5 z-30",
          borderRadius: open ? "5%" : "50%",
          width: open ? "15rem" : "5rem",
          height: open ? "20rem" : "5rem",
        }}
        type="button"
        onClick={handleClick}
        transition={{
          type: "easeInOut",
        }}
        ref={ref}
        role="button"
      >
        {!open && (
          <span className="absolute top-0 right-0 flex items-center justify-center rounded-full bg-red-700 w-5 h-5 z-40 text-xs text-white">
            {files.length}
          </span>
        )}
        <AnimatePresence>
          {!open ? (
            <BsFillJournalBookmarkFill className="w-10 h-10 text-white" />
          ) : (
            <motion.ul className="overflow-auto h-full w-full space-y-2">
              {files.map((file, index) => (
                <motion.li
                  key={index}
                  variants={variants}
                  initial={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1 }}
                  className="block mx-auto p-2 bg-white rounded-md cursor-pointer text-ellipsis overflow-hidden w-full border border-gray-300 shadow-md"
                  title={file.name}
                >
                  {file.name}
                </motion.li>
              ))}
              <motion.li
                variants={variants}
                className="block relative mx-auto p-2 bg-white rounded-md cursor-pointer w-full border border-gray-300 shadow-md text-clip"
                initial={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1 }}
              >
                <input
                  type="file"
                  name="upload"
                  id="file"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      for (let i = 0; i < files.length; i++) {
                        uploadFile(files[i]);
                      }
                    }
                  }}
                />
                <motion.label
                  className="cursor-pointer text-xl w-full h-full flex items-center justify-center"
                  htmlFor="file"
                >
                  +
                </motion.label>
              </motion.li>
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
