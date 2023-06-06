"use client";

import {
  LexicalTypeaheadMenuPlugin,
  TypeaheadOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { useCallback, useMemo, useState } from "react";
import { GET_SUGGESTION_COMMAND } from "./suggestion-plugin";
import { GET_IDEA_COMMAND } from "./idea-plugin";
import { GET_INSPIRATION_COMMAND } from "./inspire-plugin";
import { GET_ASK_COMMAND } from "./ask-plugin";
import { LexicalCommand, TextNode } from "lexical";
import * as ReactDOM from "react-dom";

const PROMPTS = ["suggest", "idea", "inspire", "ask"];

class PromptOption extends TypeaheadOption {
  title: string;
  command: LexicalCommand<string>;

  constructor(title: string, command: LexicalCommand<string>) {
    super(title);
    this.title = title;
    this.command = command;
  }
}

interface PromptMenuItemProps {
  index: number;
  isSelected: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  option: PromptOption;
}

function PromptMenuItem({
  index,
  isSelected,
  onMouseEnter,
  onClick,
  option,
}: PromptMenuItemProps) {
  return (
    <li
      key={option.key}
      className={`${
        isSelected ? "bg-gray-100" : ""
      } flex items-center px-4 py-2 text-sm`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="flex-1">/{option.title}</span>
    </li>
  );
}

function getCommand(title: string): LexicalCommand<string> | undefined {
  switch (title) {
    case "suggest":
      return GET_SUGGESTION_COMMAND;
    case "idea":
      return GET_IDEA_COMMAND;
    case "inspire":
      return GET_INSPIRATION_COMMAND;
    case "ask":
      return GET_ASK_COMMAND;
  }
}

export default function PromptPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState("");

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const promptOptions: PromptOption[] = PROMPTS.map((prompt) => {
    const command = getCommand(prompt);
    if (command) {
      return new PromptOption(prompt, command);
    }
  }).filter((option) => option !== undefined) as PromptOption[];

  const onSelectOption = useCallback(
    (
      selectedOption: PromptOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      const { command } = selectedOption;

      if (nodeToRemove) {
        editor.update(() => {
          if (nodeToRemove) {
            nodeToRemove.remove();
          }
        });
      }

      closeMenu();

      editor.dispatchCommand(command, "");
    },
    [editor]
  );

  const options = useMemo(() => {
    if (queryString.length === 0) {
      return promptOptions;
    }

    const query = queryString.toLowerCase();

    return promptOptions.filter((option) => {
      return option.title.toLowerCase().includes(query);
    });
  }, [queryString, promptOptions]);

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={(query) => {
        setQueryString(query || "");
      }}
      onSelectOption={onSelectOption}
      options={options}
      triggerFn={checkForTriggerMatch}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, options, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (anchorElementRef.current == null || options.length === 0) {
          return null;
        }

        return ReactDOM.createPortal(
          <ul className="absolute z-10 w-32 mt-6 overflow-hidden bg-white rounded-md shadow-lg">
            {options.map((option, index) => (
              <PromptMenuItem
                key={option.key}
                index={index}
                isSelected={index === selectedIndex}
                onMouseEnter={() => {
                  setHighlightedIndex(index);
                }}
                onClick={() => {
                  setHighlightedIndex(index);
                  selectOptionAndCleanUp(option);
                }}
                option={option}
              />
            ))}
          </ul>,
          anchorElementRef.current
        );
      }}
    />
  );
}
