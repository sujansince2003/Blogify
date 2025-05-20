import { ChangeEvent } from "react";

async function handleFile(e: ChangeEvent<HTMLInputElement>) {
  const file = e.target?.files?.[0] || null;
  const uploadPreset = import.meta.env.VITE_CloudinaryUploadPreset;
  if (!file) return;
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "react-hono");
  data.append("cloud_name", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${uploadPreset}/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  const imgData = await res.json();
  console.log(imgData);
}

const Upload = () => {
  return (
    <div>
      <input type="file" name="avatar" onChange={handleFile} />
    </div>
  );
};

export default Upload;
