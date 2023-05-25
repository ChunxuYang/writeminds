"use client";

import { Switch, Text } from "@nextui-org/react";
import { useState } from "react";
import { TbRobot, TbRobotOff } from "react-icons/tb";
import LexicalEditor from "~/components/lexical-editor";
import Upload from "~/components/upload";

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
  const [completionOn, setCompletionOn] = useState(true);

  return (
    <main className="h-full bg-gray-50 py-8 flex flex-col justify-center relative overflow-hidden lg:py-12">
      <div className="absolute top-0 left-0 m-8 flex flex-col">
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
      </div>
      <LexicalEditor completionOn={completionOn} />
      {/* <button className="fixed bottom-0 right-0 m-5 p-5 bg-blue-500 rounded-full">
        upload
      </button> */}
      <Upload />
    </main>
  );
}
