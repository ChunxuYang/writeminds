"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { memo, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";

import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $nodesOfType,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_NORMAL,
  INSERT_PARAGRAPH_COMMAND,
  KEY_SPACE_COMMAND,
  KEY_TAB_COMMAND,
  LexicalCommand,
  createCommand,
} from "lexical";
import {
  $createCompletionNode,
  CompletionNode,
} from "~/components/plugins/custom-nodes/completion-node";

let requestTime = "";
function setRequestTime(time: string) {
  requestTime = time;
}

export const GET_COMPLETION_COMMAND: LexicalCommand<string> = createCommand();

function CompletionPlugin() {
  const [editor] = useLexicalComposerContext();
  // const [requestTime, setRequestTime] = useState<string>("");
  console.log("rendering");

  useEffect(() => {
    const removeCompletionListener = editor.registerUpdateListener(
      ({ tags }) => {
        if (tags.has("add-completion")) {
          return;
        }

        editor.update(() => {
          console.log("removing");
          setRequestTime("");

          if ($nodesOfType(CompletionNode).length > 0) {
            $nodesOfType(CompletionNode).forEach((node) => {
              // setAborted(true);
              node.remove();
            });
          }
        });
      }
    );

    return () => {
      removeCompletionListener();
    };
  }, [editor]);

  async function getCompletion(): Promise<string> {
    // based on every text before the cursor, get the completion
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return "";
    }

    $getRoot().getTextContent();

    const cursorPosition = selection.anchor.offset;
    const prompt = $getRoot().getTextContent().slice(0, cursorPosition);

    const res = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        text: prompt,
      }),
    }).then((res) => res.json());

    return res.completion;
  }

  async function triggerCompletion() {
    const rt = Date.now().toString();
    console.log(rt);
    setRequestTime(rt);
    console.log(requestTime);
    const completion = await getCompletion();
    if (rt !== requestTime) {
      console.log(requestTime, "aborted");
      return;
    }
    editor.dispatchCommand(GET_COMPLETION_COMMAND, completion);
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<string>(
        GET_COMPLETION_COMMAND,
        (completionText) => {
          // only allow one completion node at a time. If there is already one, remove it.
          if ($nodesOfType(CompletionNode).length > 0) {
            console.log("removing");
            setRequestTime("");
            $nodesOfType(CompletionNode).forEach((node) => {
              node.remove();
            });
          }

          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            return false;
          }

          const new_completionNode = $createCompletionNode(
            completionText,
            false
          );

          editor.update(
            () => {
              selection.insertNodes([new_completionNode], true);
            },
            {
              tag: "add-completion",
            }
          );

          return true;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (payload) => {
          payload.preventDefault();
          if ($nodesOfType(CompletionNode).length > 0) {
            $nodesOfType(CompletionNode).forEach((node) => {
              const textNode = $createTextNode(node.__text);
              node.replace(textNode);

              textNode.select();
              return true;
            });
          }
          return true;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_SPACE_COMMAND,
        (payload) => {
          payload.preventDefault();

          // now insert the space
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            return false;
          }

          editor.update(
            () => {
              selection.insertText(" ");
            },
            {
              tag: "add-completion",
            }
          );

          triggerCompletion();

          return true;
        },
        COMMAND_PRIORITY_NORMAL
      ),
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          triggerCompletion();

          return false;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor]);

  return null;
}

export default memo(CompletionPlugin);
