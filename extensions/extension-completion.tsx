"use client";

import { Extension } from "@tiptap/core";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import openai from "~/services/openai-service";

async function getCompletion(text: string): Promise<string> {
  // const completion = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: text,
  // });

  // return completion.data.choices[0].text || "";

  // return dummy text for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("dummy text");
    }, 300);
  });
}

/**
 * This extension is responsible for the autocompletion feature.
 * when user types something, it will send the text before the cursor to the openai api
 * and get the completion text back.
 *
 * The completion will be displayed as a decoration after the cursor.
 * When user presses tab, the completion will be inserted after cursor and the decoration will be removed.
 */

export default Extension.create({
  name: "completion",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("completion"),
        props: {
          decorations: (state) => {
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            const nodeBefore = selection.$from.nodeBefore;
            if (nodeBefore) {
              const text = nodeBefore.text;
              const from = selection.$from.pos - text.length;
              const to = selection.$from.pos;
              decorations.push(
                Decoration.inline(from, to, {
                  class: "completion",
                })
              );
            }
            return DecorationSet.create(doc, decorations);
          },
        },
        appendTransaction: (transactions, oldState, newState) => {
          const { doc, selection } = newState;
          const nodeBefore = selection.$from.nodeBefore;
          if (nodeBefore) {
            const text = nodeBefore.text;
            const from = selection.$from.pos - text.length;
            const to = selection.$from.pos;
            const decoration = Decoration.inline(from, to, {
              class: "completion",
            });
            return newState.tr.setMeta("addDecoration", decoration);
          }
        },
      }),
    ];
  },
  addCommands() {
    return {
      complete: (state, dispatch) => {
        const { doc, selection } = state;
        const nodeBefore = selection.$from.nodeBefore;
        if (nodeBefore) {
          const text = nodeBefore.text;
          const from = selection.$from.pos - text.length;
          const to = selection.$from.pos;
          const decoration = Decoration.inline(from, to, {
            class: "completion",
          });
          dispatch?.(state.tr.setMeta("addDecoration", decoration));
        }
      },
    };
  },
});
