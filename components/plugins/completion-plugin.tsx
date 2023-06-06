"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
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

export const GET_COMPLETION_COMMAND: LexicalCommand<string> = createCommand();

export default function CompletionPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeCompletionListener = editor.registerUpdateListener(
      ({ tags }) => {
        if (tags.has("add-completion")) {
          return;
        }

        editor.update(() => {
          if ($nodesOfType(CompletionNode).length > 0) {
            $nodesOfType(CompletionNode).forEach((node) => {
              setAborted(true);
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

  const [aborted, setAborted] = useState(false);

  async function triggerCompletion() {
    const completion = await getCompletion();
    if (aborted) {
      setAborted(false);
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
            $nodesOfType(CompletionNode).forEach((node) => {
              setAborted(true);
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
