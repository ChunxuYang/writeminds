import {
  EditorConfig,
  LexicalNode,
  NodeKey,
  DecoratorNode,
  LexicalEditor,
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
      </div>
    );
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
