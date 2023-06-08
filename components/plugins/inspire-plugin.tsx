"use client";

import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  LexicalCommand,
  createCommand,
} from "lexical";
import { AiFillBulb } from "react-icons/ai";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { Input, Modal, Loading } from "@nextui-org/react";
import { mergeRegister } from "@lexical/utils";
//import { $createInspirationNode } from "~/components/plugins/custom-nodes/inspiration-node";
import { motion } from "framer-motion";

export const GET_INSPIRATION_COMMAND: LexicalCommand<string> = createCommand();

// Trigger command is /inspire
const trigger_command = "/inspire ";

export default function InspirationPlugin() {
  const [editor] = useLexicalComposerContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [inspirationLoading, setInspirationLoading] = useState(false);

  const [question, setQuestion] = useState("");

  const [inspirations, setInspirations] = useState<string[]>([]);

  const [selectedInspiration, setSelectedInspiration] = useState<string | null>(
    null
  );

  function closeHandler() {
    setModalOpen(false);
    setInspirationLoading(false);
    setQuestion("");
    setSelectedInspiration(null);
    setInspirations([]);
    editor.focus();
    editor.update(() => {});
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<string>(
        GET_INSPIRATION_COMMAND,
        () => {
          setModalOpen(true);
          return true;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor]);

  const [totalContent, setTotalContent] = useState("");

  return (
    <Modal open={modalOpen} onClose={closeHandler}>
      <Modal.Header>/Inspire</Modal.Header>
      <Modal.Body>
        <Input
          placeholder="Type anything to get inspired"
          rounded
          aria-label="Type anything to get inspired"
          bordered
          className="rounded"
          clearable
          contentRightStyling={false}
          size="md"
          contentRight={
            inspirationLoading ? (
              <Loading
                type="points"
                color="primary"
                size="sm"
                className="mr-2"
              />
            ) : (
              <motion.button
                className="rounded-full bg-primary p-[5px] mr-2 cursor-pointer text-white z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={async () => {
                  setInspirationLoading(true);
                  editor.getEditorState().read(() => {
                    const rootNode = $getRoot();
                    const allContent = rootNode.getTextContent();
                    setTotalContent(allContent);
                    fetch("/api/inspire", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        text: allContent,
                      }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        setInspirationLoading(false);
                        setInspirations(data);
                      })
                      .catch((error) => {
                        setInspirationLoading(false);
                        setInspirations([]);
                        console.error("Error:", error);
                      });
                  });
                }}
              >
                <AiFillBulb />
              </motion.button>
            )
          }
        />

        <motion.div
          className="rounded bg-gray-100 p-3 mt-2 space-y-2 flex flex-col"
          layout
          layoutRoot
          style={{
            display: inspirations.length > 0 ? "block" : "none",
          }}
        >
          {inspirations.map((inspiration, index) => (
            <motion.div
              key={index}
              layout
              className="rounded bg-white p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                if (!selectedInspiration) {
                  setSelectedInspiration(inspiration);
                  setInspirationLoading(true);
                  fetch("/api/inspire/detail", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      text: totalContent,
                      choice: inspiration,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      setInspirations([data]);
                      setInspirationLoading(false);
                    })
                    .catch((error) => {
                      setInspirationLoading(false);
                      setSelectedInspiration(null);
                      console.error("Error:", error);
                    });
                } else {
                  editor.update(() => {
                    const selection = $getSelection();

                    if (!$isRangeSelection(selection)) {
                      return false;
                    }

                    selection.insertText(inspiration);
                    closeHandler();
                  });
                }
              }}
            >
              {inspiration}
            </motion.div>
          ))}
        </motion.div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
