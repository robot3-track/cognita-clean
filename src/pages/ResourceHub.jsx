import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";

import { Upload, Globe, Lock, Trash2, Eye, Search, Plus, Loader2, FileText, File, X, ExternalLink, Download, BookOpen } from "lucide-react";

export default function ResourceHub() {
  const [user, setUser] = useState(null);
  const [myFiles, setMyFiles] = useState([]);
  const [publicFiles, setPublicFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("community"); // "mine" | "community"
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewingFile, setViewingFile] = useState(null);
  const fileInputRef = useRef(null);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const me = await db.auth.me();
    setUser(me);
    const [mine, pub] = await Promise.all([
      db.entities.SharedFile.filter({ created_by: me.email }, "-created_date", 200),
      db.entities.SharedFile.filter({ is_public: true }, "-created_date", 200),
    ]);
    setMyFiles(mine);
    setPublicFiles(pub.filter(f => f.created_by !== me.email));
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const uploadFile = async () => {
    if (!selectedFile || !title.trim()) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file: selectedFile });
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    const fileType = ext === "pdf" ? "pdf"
      : ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ? "image"
      : ["mp4", "webm", "mov"].includes(ext) ? "video"
      : ["mp3", "wav", "ogg"].includes(ext) ? "audio"
      : "other";
    const record = await db.entities.SharedFile.create({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      file_url,
      file_type: fileType,
      file_size: selectedFile.size,
      is_public: isPublic,
      author_email: user.email,
      author_name: user.full_name || user.email.split("@")[0],
    });
    setMyFiles(prev => [record, ...prev]);
    if (isPublic) setPublicFiles(prev => [record, ...prev]);
    setTitle(""); setDescription(""); setSubject(""); setSelectedFile(null); setIsPublic(true);
    setShowUpload(false);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deleteFile = async (id) => {
    setMyFiles(prev => prev.filter(f => f.id !== id));
    setPublicFiles(prev => prev.filter(f => f.id !== id));
    await db.entities.SharedFile.delete(id);
  };

  const togglePublic = async (file) => {
    const updated = await db.entities.SharedFile.update(file.id, { is_public: !file.is_public });
    setMyFiles(prev => prev.map(f => f.id === file.id ? updated : f));
    if (!file.is_public) setPublicFiles(prev => [updated, ...prev]);
    else setPublicFiles(prev => prev.filter(f => f.id !== file.id));
  };

  const openFile = (file) => {
    setViewingFile(file);
    db.entities.SharedFile.update(file.id, { view_count: (file.view_count || 0) + 1 }).catch(() => {});
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileType) => {
    if (fileType === "pdf") return <FileText className="w-5 h-5 text-red-400" />;
    if (fileType === "image") return <Eye className="w-5 h-5 text-blue-400" />;
    if (fileType === "video") return <File className="w-5 h-5 text-purple-400" />;
    return <File className="w-5 h-5 text-gray-400" />;
  };

  const displayList = tab === "mine"
    ? (search.trim() ? myFiles.filter(f => [f.title, f.subject, f.description].some(x => x?.toLowerCase().includes(search.toLowerCase()))) : myFiles)
    : (search.trim() ? publicFiles.filter(f => [f.title, f.subject, f.description, f.author_name].some(x => x?.toLowerCase().includes(search.toLowerCase()))) : publicFiles);

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">Resource Hub</h1>
            <p className="text-sm" style={mutedStyle}>Share & browse study files</p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Upload
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[["community", "Community", Globe], ["mine", "My Files", Lock]].map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === id ? "bg-violet-500/20 text-violet-400" : "opacity-50 hover:opacity-80"}`}
              style={tab !== id ? cardStyle : {}}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
        </div>

        {/* Upload Form */}
        {showUpload && (
          <div className="rounded-3xl p-6 mb-6" style={cardStyle}>
            <h3 className="font-bold mb-4">Upload File</h3>
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-violet-500/50"
                style={{ borderColor: "var(--app-border)" }}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-30" />
                {selectedFile
                  ? <p className="text-sm font-semibold">{selectedFile.name} <span className="opacity-50">({formatSize(selectedFile.size)})</span></p>
                  : <p className="text-sm" style={mutedStyle}>Click to select a file (PDF, image, video, etc.)</p>}
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.mp4,.mp3,.wav,.doc,.docx,.ppt,.pptx,.txt" />
              </div>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title *" className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject (e.g. Biology, History)" className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" rows={2} className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPublic(p => !p)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isPublic ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : ""}`}
                  style={!isPublic ? { borderColor: "var(--app-border)" } : {}}>
                  {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {isPublic ? "Public" : "Private"}
                </button>
                <p className="text-xs" style={mutedStyle}>{isPublic ? "Visible to everyone" : "Only you can see this"}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUpload(false)} className="flex-1 py-3 rounded-2xl text-sm font-semibold" style={cardStyle}>Cancel</button>
                <button onClick={uploadFile} disabled={uploading || !selectedFile || !title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-3 rounded-2xl text-sm font-semibold transition-all">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File list */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-16 rounded-3xl" style={cardStyle}>
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="font-semibold" style={mutedStyle}>{tab === "mine" ? "No files uploaded yet" : "No public files yet"}</p>
            <p className="text-sm mt-1" style={{ ...mutedStyle, opacity: 0.6 }}>{tab === "mine" ? "Upload your first study file" : "Be the first to share!"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayList.map(file => (
              <div key={file.id} className="rounded-2xl p-4" style={cardStyle}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    {getFileIcon(file.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{file.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <p className="text-xs" style={mutedStyle}>
                        {tab === "community" ? (file.author_name || "Anonymous") + " · " : ""}
                        {file.subject && file.subject + " · "}
                        {file.file_type?.toUpperCase()}
                        {file.file_size ? " · " + formatSize(file.file_size) : ""}
                      </p>
                      {(file.view_count || 0) > 0 && <span className="text-xs" style={mutedStyle}>{file.view_count} views</span>}
                    </div>
                    {file.description && <p className="text-xs mt-1 truncate" style={{ ...mutedStyle, opacity: 0.7 }}>{file.description}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openFile(file)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all">
                      <Eye className="w-3 h-3" /> View
                    </button>
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" download className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold opacity-50 hover:opacity-90 transition-all" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                      <Download className="w-3 h-3" />
                    </a>
                    {tab === "mine" && (
                      <>
                        <button onClick={() => togglePublic(file)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${file.is_public ? "bg-emerald-500/20 text-emerald-400" : "opacity-40 hover:opacity-80"}`}
                          style={!file.is_public ? { background: "var(--app-bg)", border: "1px solid var(--app-border)" } : {}}>
                          {file.is_public ? "Public" : "Private"}
                        </button>
                        <button onClick={() => deleteFile(file.id)} className="p-1.5 rounded-lg opacity-30 hover:opacity-80 text-red-400 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.92)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--app-surface)", borderBottom: "1px solid var(--app-border)" }}>
            <p className="font-bold text-sm truncate flex-1">{viewingFile.title}</p>
            <div className="flex gap-2 shrink-0">
              <a href={viewingFile.file_url} target="_blank" rel="noopener noreferrer" download
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-all">
                <Download className="w-3.5 h-3.5" /> Download
              </a>
              <a href={viewingFile.file_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all">
                <ExternalLink className="w-3.5 h-3.5" /> Open
              </a>
              <button onClick={() => setViewingFile(null)} className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {viewingFile.file_type === "pdf" ? (
              <iframe
                src={`${viewingFile.file_url}#toolbar=1&view=FitH`}
                className="w-full h-full"
                title={viewingFile.title}
                style={{ border: "none" }}
              />
            ) : viewingFile.file_type === "image" ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <img src={viewingFile.file_url} alt={viewingFile.title} className="max-w-full max-h-full object-contain rounded-xl" />
              </div>
            ) : viewingFile.file_type === "video" ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <video src={viewingFile.file_url} controls className="max-w-full max-h-full rounded-xl" style={{ maxHeight: "calc(100vh - 60px)" }} />
              </div>
            ) : viewingFile.file_type === "audio" ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <audio src={viewingFile.file_url} controls className="w-full max-w-lg" />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                <File className="w-16 h-16 opacity-20" />
                <p className="text-sm opacity-60">Preview not available for this file type.</p>
                <a href={viewingFile.file_url} target="_blank" rel="noopener noreferrer" download
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all">
                  <Download className="w-4 h-4" /> Download File
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}