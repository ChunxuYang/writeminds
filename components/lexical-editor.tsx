"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import CompletionPlugin from "./plugins/completion-plugin";
import ToolbarPlugin from "./plugins/toolbar-plugin";
import { CompletionNode } from "./plugins/custom-nodes/completion-node";
import TreeViewPlugin from "./plugins/tree-view-plugin";
import SuggestionPlugin from "./plugins/suggestion-plugin";
import { SuggestionNode } from "./plugins/custom-nodes/suggestion-node";
//import functions
import IdeaPlugin from "./plugins/idea-plugin";
import InspirePlugin from "./plugins/inspire-plugin";
import AskPlugin from "./plugins/ask-plugin";

function onError(error: Error) {
  console.error(error);
}

interface LexicalEditorProps {
  completionOn?: boolean;
}

export default function LexicalEditor({ completionOn }: LexicalEditorProps) {
  const config = {
    namespace: "lexical-editor",
    theme: {
      root: "prose prose-slate mx-auto lg:prose-lg w-full outline-none z-10",
      link: "cursor-pointer",
      placeholder: "text-gray-400",
      text: {
        bold: "font-semibold",
        underline: "underline",
        italic: "italic",
        strikethrough: "line-through",
        underlineStrikethrough: "underlined-line-through",
      },
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      CompletionNode,
      SuggestionNode,
    ],
    onError,
  };

  return (
    <div className="relative w-full h-full px-6 py-12 rounded-md bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28 overflow-auto">
      <LexicalComposer initialConfig={config}>
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={
            <div
              className="prose prose-slate mx-auto lg:prose-lg w-full my-16 z-0 text-gray-400"
              style={{
                display: "inline-block",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                pointerEvents: "none",
              }}
            >
              Start writing...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <AutoFocusPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />

        {completionOn ? <CompletionPlugin /> : <></>}
        {/* <CompletionPlugin /> */}
        <SuggestionPlugin />
        <IdeaPlugin /> 
        <InspirePlugin />
        <AskPlugin />
        <TabIndentationPlugin />


        {/* <ToolbarPlugin /> */}
        {/* <TreeViewPlugin /> */}
      </LexicalComposer>
    </div>
  );
}
