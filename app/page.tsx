"use client";

import { Switch, Text } from "@nextui-org/react";
import { useState } from "react";
import { TbRobot, TbRobotOff } from "react-icons/tb";
import LexicalEditor from "~/components/lexical-editor";
import Upload from "~/components/upload";

const audienceKnowledgeOptions = [
  "Novice",
  "Intermediate",
  "Proficient",
  "Advanced",
  "Expert",
];

const toneOptions = ["Formal", "Neutral", "Informal", "Friendly", "Humorous"];

const writingTypeOptions = [
  "Narrative",
  "Descriptive",
  "Expository",
  "Persuasive",
  "Creative",
];

const tileFunctions = [
  "/suggest",
  "/idea",
  "/ask",
  "/inspire",
  "^_^ and more coming...",
];

export default function Home() {
  // const uploadImage = async (file: File) => {
  //   const formData = new FormData();
  //   formData.append("image", file);
  //   const res = await fetch("/api/upload", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   const data = await res.json();
  //   return data.url;
  // };
  const [completionOn, setCompletionOn] = useState(false);

  const [dropdownValues, setDropdownValues] = useState({
    dropdown1: audienceKnowledgeOptions[2],
    dropdown2: toneOptions[2],
    dropdown3: writingTypeOptions[2],
  });

  const handleDropdownChange = (dropdownName: any, value: any) => {
    setDropdownValues((prevValues) => ({
      ...prevValues,
      [dropdownName]: value,
    }));
  };

  return (
    <main className="h-full bg-white py-8 flex flex-col lg:flex-row justify-center items-center relative overflow-hidden lg:py-12 lg:w-4/5">
      {/* <div className="absolute top-0 left-0 m-8 flex flex-col">
        <div className="flex items-center space-x-2">
          <span
            className="text-gray-800 text-xl font-bold cursor-pointer"
            onClick={() => setCompletionOn(!completionOn)}
          >
            Enable Completion
          </span>
          <Switch
            checked={completionOn}
            onChange={() => setCompletionOn(!completionOn)}
            bordered
            shadow
            size="xl"
            color="warning"
            iconOn={<TbRobot />}
            iconOff={<TbRobotOff />}
          />
        </div>
      </div> */}
      <LexicalEditor completionOn={completionOn} />

      <div className="fixed top-0 right-0 m-12 shadow-lg">
        <div className="h-full bg-white border border-gray-300 rounded p-4 flex flex-col space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Choose Options</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-semibold w-32">
                Audience Knowledge:
              </span>
              <select
                value={dropdownValues.dropdown1}
                onChange={(event) =>
                  handleDropdownChange("dropdown1", event.target.value)
                }
                className="w-full font-sans px-2 py-1 rounded border border-gray-400 focus:outline-none"
              >
                {audienceKnowledgeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold w-32">Tone:</span>
              <select
                value={dropdownValues.dropdown2}
                onChange={(event) =>
                  handleDropdownChange("dropdown2", event.target.value)
                }
                className="w-full font-sans px-2 py-1 rounded border border-gray-400 focus:outline-none"
              >
                {toneOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold w-32">Writing Type:</span>
              <select
                value={dropdownValues.dropdown3}
                onChange={(event) =>
                  handleDropdownChange("dropdown3", event.target.value)
                }
                className="w-full font-sans px-2 py-1 rounded border border-gray-400 focus:outline-none"
              >
                {writingTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-800 text-lg font-semibold cursor-pointer">
              Enable Completion
            </span>
            <div className="ml-2">
              <Switch
                checked={completionOn}
                onChange={() => setCompletionOn(!completionOn)}
                bordered
                shadow
                size="xl"
                color="warning"
                iconOn={<TbRobot />}
                iconOff={<TbRobotOff />}
              />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Function List</h2>
          </div>
          <div className="mt-4 text-gray-600">
            <ul className="pl-4">
              {tileFunctions.map((functionName) => (
                <li key={functionName}>{functionName}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* <button className="fixed bottom-0 right-0 m-5 p-5 bg-blue-500 rounded-full">
        upload
      </button> */}
      {/* <Upload /> */}
    </main>
  );
}
