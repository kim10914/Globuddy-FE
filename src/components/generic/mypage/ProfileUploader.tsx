import { useState, ChangeEvent } from "react";

export default function ProfileUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // 미리보기
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target?.result) {
          setPreview(ev.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("이미지를 선택하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await fetch("/api/uploadProfile", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("업로드 실패");

      const data: { url: string } = await res.json(); // 서버에서 { url: string } 리턴한다고 가정
      console.log("업로드 성공:", data.url);
      // 여기서 setProfileUrl(data.url) 같은 식으로 상태 업데이트 가능
    } catch (err) {
      console.error("업로드 실패:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <label
        htmlFor="fileInput"
        className="cursor-pointer flex items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-gray-400 hover:bg-gray-100"
      >
        {preview ? (
          <img
            src={preview}
            alt="미리보기"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>사진 선택</span>
        )}
      </label>

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow"
      >
        업로드
      </button>
    </div>
  );
}
