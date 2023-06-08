"use client";

import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  LexicalCommand,
  createCommand,
} from "lexical";
import { AiFillRobot } from "react-icons/ai";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { Input, Modal, Loading } from "@nextui-org/react";
import { mergeRegister } from "@lexical/utils";
//import { $createSuggestionNode } from "~/components/plugins/custom-nodes/suggestion-node";
import { motion } from "framer-motion";

export const GET_IDEA_COMMAND: LexicalCommand<string> = createCommand();

// trigger command is /idea
const trigger_command = "/idea ";

export default function IdeaPlugin() {
  const [editor] = useLexicalComposerContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [ideaLoading, setIdeaLoading] = useState(false);

  const [question, setQuestion] = useState("");

  const [ideas, setIdeas] = useState<string[]>([]);

  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);

  function closeHandler() {
    setModalOpen(false);
    setIdeaLoading(false);
    setQuestion("");
    setSelectedIdea(null);
    setIdeas([]);
    editor.focus();
    editor.update(() => {});
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<string>(
        GET_IDEA_COMMAND,
        () => {
          setModalOpen(true);
          return true;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor]);

  const [totalContent, setTotalContent] = useState("");

  // return null;

  return (
    <Modal open={modalOpen} onClose={closeHandler}>
      <Modal.Header>/Idea</Modal.Header>
      <Modal.Body>
        <Input
          placeholder="Type anything to ask for an idea"
          rounded
          aria-label="Type anything to ask for an idea"
          bordered
          className="rounded"
          clearable
          contentRightStyling={false}
          size="md"
          contentRight={
            ideaLoading ? (
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
                  setIdeaLoading(true);
                  editor.getEditorState().read(() => {
                    const rootNode = $getRoot();
                    const allContent = rootNode.getTextContent();
                    setTotalContent(allContent);
                    fetch("/api/idea", {
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
                        setIdeaLoading(false);
                        setIdeas(data);
                      })
                      .catch((error) => {
                        setIdeaLoading(false);
                        setIdeas([]);
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

        <motion.div
          className="rounded bg-gray-100 p-3 mt-2 space-y-2 flex flex-col"
          layout
          layoutRoot
          // initial={{ opacity: 0 }}
          // animate={{
          //   height: ideaLoading ? "auto" : 0,
          //   opacity: ideaLoading ? 1 : 0,
          // }}
          style={{
            display: ideas.length > 0 ? "block" : "none",
          }}
        >
          {ideas.map((idea, index) => (
            <motion.div
              key={index}
              layout
              className="rounded bg-white p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                if (!selectedIdea) {
                  setSelectedIdea(idea);
                  setIdeaLoading(true);
                  fetch("/api/idea/detail", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      text: totalContent,
                      choice: idea,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      setIdeas([data]);
                      setIdeaLoading(false);
                    })
                    .catch((error) => {
                      setIdeaLoading(false);
                      // setIdeas([]);
                      setSelectedIdea(null);
                      console.error("Error:", error);
                    });
                } else {
                  editor.update(() => {
                    const selection = $getSelection();

                    if (!$isRangeSelection(selection)) {
                      return false;
                    }

                    selection.insertText(idea);
                    closeHandler();
                  });
                }
              }}
            >
              {idea}
            </motion.div>
          ))}
        </motion.div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
