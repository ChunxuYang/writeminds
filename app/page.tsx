import LexicalEditor from "~/components/lexical-editor";

export default function Home() {
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };
  return (
    <main className="h-full bg-gray-50 py-8 flex flex-col justify-center relative overflow-hidden lg:py-12">
      <LexicalEditor />
      {/* <button className="fixed bottom-0 right-0 m-5 p-5 bg-blue-500 rounded-full">
        upload
      </button> */}
    </main>
  );
}
