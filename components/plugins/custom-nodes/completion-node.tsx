import {
  EditorConfig,
  LexicalNode,
  NodeKey,
  DecoratorNode,
  LexicalEditor,
  SerializedLexicalNode,
} from "lexical";
import { ReactNode } from "react";

export class CompletionNode extends DecoratorNode<ReactNode> {
  __text: string;
  __accepted: boolean;
  constructor(text: string, acccepted: boolean, key?: NodeKey) {
    super(key);
    this.__text = text;
    this.__accepted = acccepted;
  }

  static getType(): string {
    return "completion";
  }

  static clone(node: CompletionNode): CompletionNode {
    return new CompletionNode(node.__text, node.__accepted, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("div");
    dom.classList.add(
      "inline",
      "text-gray-300",
      "select-none",
      "pointer-events-none"
    );
    return dom;
  }

  updateDOM(): false {
    return false;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): ReactNode {
    return (
      <div className="inline text-gray-300 select-none pointer-events-none">
        {this.__text}
        <span className="inline-block rounded-lg border border-gray-300 text-gray-300 px-1 ml-1 text-xs">
          Tab
        </span>
      </div>
    );
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: CompletionNode.getType(),
      version: 1,
    };
  }

  static importJSON(json: SerializedLexicalNode): CompletionNode {
    return new CompletionNode("", false);
  }
}

export const $createCompletionNode = (
  text: string,
  accepted: boolean,
  key?: NodeKey
) => {
  return new CompletionNode(text, accepted, key);
};

export const $isCompletionNode = (node?: LexicalNode): boolean => {
  return node instanceof CompletionNode;
};
