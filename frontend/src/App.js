import React, { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <Header setPage={setPage} />
      {page === "home" && <Home setPage={setPage} />}
      {page === "upload" && <Upload setPage={setPage} />}
      {page === "gallery" && <Gallery />}
      {page === "admin" && <Admin />}
    </div>
  );
}

function Header({ setPage }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => setPage("home")}>Home</button>{" "}
      <button onClick={() => setPage("upload")}>Upload</button>{" "}
      <button onClick={() => setPage("gallery")}>Gallery</button>{" "}
      <button onClick={() => setPage("admin")}>Admin</button>
    </div>
  );
}

function Home({ setPage }) {
  return (
    <div>
      <h1>Revival 2.0</h1>
      <p>A simple local cultural archive demo app.</p>
      <button onClick={() => setPage("upload")}>Start Uploading</button>
    </div>
  );
}

function Upload({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    artType: "",
    location: "",
    description: "",
  });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a video file");

    const fd = new FormData();
    fd.append("file", file);
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    const res = await fetch("/api/submissions", { method: "POST", body: fd });
    if (res.ok) alert("Uploaded successfully!");
    setPage("gallery");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} /><br/>
      <input placeholder="Art Type" onChange={(e) => setForm({ ...form, artType: e.target.value })} /><br/>
      <input placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} /><br/>
      <textarea placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea><br/>
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} /><br/>
      <button type="submit">Upload</button>
    </form>
  );
}

function Gallery() {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then(setVideos);
  }, []);

  return (
    <div>
      <h2>Approved Gallery</h2>
      {videos.map((v) => (
        <div key={v.id} style={{ marginBottom: "20px" }}>
          <h3>{v.artType}</h3>
          <p>{v.name} - {v.location}</p>
          <video src={`file://${v.videoPath}`} width="400" controls />
          <p>{v.description}</p>
        </div>
      ))}
    </div>
  );
}

function Admin() {
  const [pending, setPending] = useState([]);
  const reload = () => fetch("/api/pending").then((r) => r.json()).then(setPending);
  useEffect(reload, []);

  const approve = async (id) => {
    await fetch(`/api/admin/approve/${id}`, { method: "POST" });
    reload();
  };
  const reject = async (id) => {
    await fetch(`/api/admin/reject/${id}`, { method: "DELETE" });
    reload();
  };

  return (
    <div>
      <h2>Pending Submissions</h2>
      {pending.map((v) => (
        <div key={v.id}>
          <h4>{v.name} - {v.artType}</h4>
          <video src={`file://${v.videoPath}`} width="300" controls />
          <div>
            <button onClick={() => approve(v.id)}>Approve</button>
            <button onClick={() => reject(v.id)}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
