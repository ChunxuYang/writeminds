"use client";

import {
  $createNodeSelection,
  $getNodeByKey,
  $setSelection,
  createCommand,
  TextNode,
  COMMAND_PRIORITY_HIGH,
} from "lexical";
import { AiFillRobot } from "react-icons/ai";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState, useEffect } from "react";
import { Button, Input, Modal, Loading } from "@nextui-org/react";
import { mergeRegister } from "@lexical/utils";
import { $getRoot } from "lexical";
import { motion } from "framer-motion";

export const GET_ASK_COMMAND = createCommand();

const trigger_command = "/ask ";

type AskItem = {
  id: number;
  answer: string;
};

export default function AskPlugin() {
  const [editor] = useLexicalComposerContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [askLoading, setAskLoading] = useState(false);
  const [currentTextNodeKey, setCurrentTextNodeKey] = useState("");
  const [totalContent, setTotalContent] = useState("");
  const [asks, setAsks] = useState<AskItem[]>([]);
  const [question, setQuestion] = useState("");

  function closeHandler() {
    setModalOpen(false);
    setAskLoading(false);
    setQuestion("");
    setAsks([]);
    editor.focus();
    editor.update(() => {});
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerNodeTransform(TextNode, (node) => {
        if (node.__text.endsWith(trigger_command)) {
          editor.update(() => {
            node.spliceText(
              node.__text.length - trigger_command.length,
              node.__text.length,
              " "
            );

            setCurrentTextNodeKey(node.__key);

            setModalOpen(true);

            return true;
          });
        }

        return true;
      }),

      editor.registerCommand(
        GET_ASK_COMMAND,
        () => {
          setModalOpen(true);
          return true;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor]);

  return (
    <Modal open={modalOpen} onClose={closeHandler}>
      <Modal.Header>/Ask</Modal.Header>
      <Modal.Body>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type anything to ask"
          rounded
          aria-label="Type anything to ask"
          bordered
          className="rounded"
          clearable
          contentRightStyling={false}
          size="md"
          contentRight={
            askLoading ? (
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
                  setAskLoading(true);
                  editor.getEditorState().read(() => {
                    const rootNode = $getRoot();
                    const allContent = rootNode.getTextContent();
                    setTotalContent(allContent);
                    fetch("/api/ask", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        text: allContent,
                        question: question,
                      }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        setAskLoading(false);
                        setAsks([{ id: 0, answer: data.answer }]);
                      })
                      .catch((error) => {
                        setAskLoading(false);
                        setAsks([]);
                        console.error("Error:", error);
                      });
                  });
                }}
              >
                <AiFillRobot />
              </motion.button>
            )
          }
        />

        {asks.length > 0 && (
          <motion.div
            className="rounded bg-gray-100 p-3 mt-2 space-y-2 flex flex-col"
            layout
            layoutRoot
          >
            {asks.map((ask) => (
              <motion.div
                key={ask.id}
                layout
                className="rounded bg-white p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  editor.update(() => {
                    const currentNode = $getNodeByKey(currentTextNodeKey);
                    if (!currentNode) return;
                    currentNode.spliceText(
                      currentNode.__text.length,
                      currentNode.__text.length,
                      "\n" + ask.answer
                    );
                    closeHandler();
                  });
                }}
              >
                {ask.answer}
              </motion.div>
            ))}
          </motion.div>
        )}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
