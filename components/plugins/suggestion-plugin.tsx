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
import { motion } from "framer-motion";

export const GET_SUGGESTION_COMMAND: LexicalCommand<string> = createCommand();

// trigger command is /suggest
const trigger_command = "/suggest ";

export default function SuggestionPlugin() {
  const [editor] = useLexicalComposerContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const [question, setQuestion] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );

  function closeHandler() {
    setModalOpen(false);
    setSuggestionLoading(false);
    setQuestion("");
    setSelectedSuggestion(null);
    setSuggestions([]);
    editor.focus();
    editor.update(() => {});
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<string>(
        GET_SUGGESTION_COMMAND,
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
      <Modal.Header>/Suggestion</Modal.Header>
      <Modal.Body>
        <Input
          placeholder="Type anything to ask for suggestion"
          rounded
          aria-label="Type anything to ask for suggestion"
          bordered
          className="rounded"
          clearable
          contentRightStyling={false}
          size="md"
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
          contentRight={
            suggestionLoading ? (
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
                  setSuggestionLoading(true);
                  editor.getEditorState().read(() => {
                    const rootNode = $getRoot();
                    const allContent = rootNode.getTextContent();
                    setTotalContent(allContent);
                    fetch("/api/suggest", {
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
                        setSuggestionLoading(false);
                        setSuggestions(data);
                      })
                      .catch((error) => {
                        setSuggestionLoading(false);
                        setSuggestions([]);
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
          //   height: suggestionLoading ? "auto" : 0,
          //   opacity: suggestionLoading ? 1 : 0,
          // }}
          style={{
            display: suggestions.length > 0 ? "block" : "none",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              layout
              className="rounded bg-white p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                if (!selectedSuggestion) {
                  setSelectedSuggestion(suggestion);
                  setSuggestionLoading(true);
                  fetch("/api/suggest/detail", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      text: totalContent,
                      choice: suggestion,
                      question: question,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      setSuggestions([data]);
                      setSuggestionLoading(false);
                    })
                    .catch((error) => {
                      setSuggestionLoading(false);
                      // setSuggestions([]);
                      setSelectedSuggestion(null);
                      console.error("Error:", error);
                    });
                } else {
                  editor.update(() => {
                    // add the suggestion to cursor position

                    const selection = $getSelection();

                    if (!$isRangeSelection(selection)) {
                      return false;
                    }

                    selection.insertText(suggestion);
                    closeHandler();
                  });
                }
              }}
            >
              {suggestion}
            </motion.div>
          ))}
        </motion.div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
