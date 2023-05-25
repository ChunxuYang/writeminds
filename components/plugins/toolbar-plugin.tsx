import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as React from "react";

import "./toolbar.css";

import { GET_COMPLETION_COMMAND } from "./completion-plugin";
import { GET_SUGGESTION_COMMAND } from "./suggestion-plugin";

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="toolbar">
      <button
        onClick={() => {
          editor.dispatchCommand(GET_SUGGESTION_COMMAND, "");
        }}
        className={"toolbar-item spaced"}
      >
        <span className="text">Insert Horizontal Rule</span>
      </button>
    </div>
  );
}
