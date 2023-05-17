import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as React from "react";

import "./toolbar.css";

import { GET_COMPLETION_COMMAND } from "./completion-plugin";

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="toolbar">
      <button
        onClick={() => {
          editor.dispatchCommand(GET_COMPLETION_COMMAND, "This is a test");
        }}
        className={"toolbar-item spaced "}
      >
        <span className="text">Insert Horizontal Rule</span>
      </button>
    </div>
  );
}
