import {
  EditorConfig,
  LexicalNode,
  NodeKey,
  DecoratorNode,
  LexicalEditor,
  SerializedLexicalNode,
  TextNode,
} from "lexical";
import { ReactNode } from "react";

export class SuggestionNode extends TextNode {
  // __text: string;
  constructor(text: string, key?: NodeKey) {
    super(text, key);
    // this.__text = text;
  }

  static getType(): string {
    return "suggestion";
  }

  static clone(node: SuggestionNode): SuggestionNode {
    return new SuggestionNode(node.__text, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    const decorationText = document.createElement("span");
    // decorationText.classList.add(
    //   "inline-block",
    //   "border-gray-300",
    //   "text-emerald-800",
    //   // "select-none",
    //   // "pointer-events-none",
    //   "px-1"
    // );
    // decorationText.innerText = "Suggest:";
    // dom.prepend(decorationText);
    dom.classList.add("bg-emerald-400");
    dom.innerText = "Suggestion: " + dom.innerText;
    return dom;
  }

  updateDOM(
    prevNode: SuggestionNode,
    dom: HTMLElement,
    config: EditorConfig
  ): boolean {
    const success = super.updateDOM(prevNode, dom, config);
    if (prevNode.__text !== this.__text) {
      dom.innerText = "Suggestion: " + dom.innerText;
    }

    return success;
  }
}

//   decorate(editor: LexicalEditor, config: EditorConfig): ReactNode {
//     return (
//       <div className="inline bg-emerald-400">
//         <span className="inline-block border-gray-300 text-emerald-800 select-none pointer-events-none">
//           Suggest
//         </span>
//         {this.__text}
//       </div>
//     );
//   }

//   exportJSON(): SerializedLexicalNode {
//     return {
//       type: SuggestionNode.getType(),
//       version: 1,
//     };
//   }

//   static importJSON(json: SerializedLexicalNode): SuggestionNode {
//     return new SuggestionNode("");
//   }
// }

export const $createSuggestionNode = (text: string, key?: NodeKey) =>
  new SuggestionNode(text, key);

export const $isSuggestionNode = (node: LexicalNode): boolean =>
  node instanceof SuggestionNode;
