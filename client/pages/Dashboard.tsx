import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Share, Trash2, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface PendingUpload {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

interface Document {
  id: number;
  title: string;
  uploadDate: string;
  description: string;
}

export default function Dashboard() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_FILE_SIZE = 20 * 1024 * 1024;
  const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const initialDocs = [
    {
      id: 1,
      title: "Market Analysis Report Q3 2024",
      uploadDate: "Oct 15, 2024",
      description:
        "The market showed strong growth in the tech sector, with a notable increase in AI investments. Consumer spending remained steady, but inflation concerns persist. Key trends include the rise of decentralized finance and...",
    },
    {
      id: 2,
      title: "Project Phoenix: Initial Proposal",
      uploadDate: "Oct 12, 2024",
      description:
        "This document outlines the initial proposal for Project Phoenix, a strategic initiative to overhaul our digital infrastructure. It covers goals, timeline, budget estimates, and key stakeholders. The project aims to enhance...",
    },
    {
      id: 3,
      title: "User Onboarding Feedback",
      uploadDate: "Oct 11, 2024",
      description:
        "A compilation of user feedback regarding the new onboarding flow. Common themes include a desire for more guided tours, clearer call-to-actions, and a more personalized experience. Several users reported...",
    },
  ];

  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>(() => {
    const stored = localStorage.getItem("documents");
    return stored ? JSON.parse(stored) : initialDocs;
  });
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
  }, [documents]);

  const handleDelete = (id: number) => {
    const previous = documents;
    const removed = previous.find((d) => d.id === id);
    setDocuments(previous.filter((d) => d.id !== id));
    toast("Document deleted", {
      description: removed?.title,
      action: {
        label: "Undo",
        onClick: () => setDocuments(previous),
      },
    });
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > MAX_FILE_SIZE) {
        return `${file.name}: File size exceeds 20MB limit`;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return `${file.name}: Invalid format. Only PDF, DOC, DOCX, TXT, XLS, XLSX allowed`;
      }

      return null;
    },
    [MAX_FILE_SIZE, ALLOWED_TYPES],
  );

  const processFiles = useCallback(
    (files: FileList) => {
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      Array.from(files).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      if (newErrors.length > 0) {
        setUploadErrors(newErrors);
      } else {
        setUploadErrors([]);
      }

      if (validFiles.length === 0) {
        return;
      }

      const uploads: PendingUpload[] = validFiles.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        progress: 0,
        status: "uploading",
      }));

      setPendingUploads((prev) => [...prev, ...uploads]);

      uploads.forEach((upload) => {
        const interval = setInterval(() => {
          setPendingUploads((prev) =>
            prev.map((item) =>
              item.id === upload.id
                ? {
                    ...item,
                    progress: Math.min(item.progress + Math.random() * 25, 95),
                  }
                : item,
            ),
          );
        }, 200);

        setTimeout(
          () => {
            clearInterval(interval);
            setPendingUploads((prev) =>
              prev.map((item) =>
                item.id === upload.id
                  ? { ...item, progress: 100, status: "completed" }
                  : item,
              ),
            );
          },
          2000 + Math.random() * 2000,
        );
      });
    },
    [validateFile],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        processFiles(event.dataTransfer.files);
        event.dataTransfer.clearData();
      }
    },
    [processFiles],
  );

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
      event.target.value = "";
    }
  };

  const markUploadDone = () => {
    const completed = pendingUploads.filter(
      (upload) => upload.status === "completed",
    );
    if (completed.length === 0) {
      toast.error("No completed uploads to add");
      return;
    }

    const newDocuments = completed.map((upload, index) => ({
      id: Date.now() + index,
      title: upload.file.name.replace(/\.[^/.]+$/, ""),
      uploadDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      description: `Uploaded ${upload.file.type || "document"} file. Processing complete and ready for analysis.`,
    }));

    setDocuments((prev) => [...newDocuments, ...prev]);
    setPendingUploads((prev) =>
      prev.filter((upload) => upload.status !== "completed"),
    );
    toast.success(`${newDocuments.length} file(s) added to library`);
  };

  const removePendingUpload = (id: string) => {
    setPendingUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  const handleShareLink = async (doc: Document) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/documents/${doc.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: doc.title,
          text: doc.description,
          url: shareUrl,
        });
        toast.success("Share sheet opened");
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Document link copied to clipboard");
    } catch (error) {
      toast.error("Unable to copy link. Please try again.");
    }
  };

  const handleDownloadDocument = (doc: Document) => {
    const content = `Title: ${doc.title}\nUploaded on: ${doc.uploadDate}\n\n${doc.description}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/[^a-z0-9-]/gi, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Download started");
  };

  return (
    <div className="min-h-screen orion-bg">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center border-b border-border/20">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-primary rounded mr-3">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-white"
            >
              <rect width="24" height="24" rx="4" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-foreground">
            Orion Hub
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </a>
          <Button
            onClick={handleLogout}
            className="bg-destructive text-white hover:bg-destructive/90 px-6"
          >
            Log Out
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[400px,1fr] gap-6 lg:gap-8">
          {/* Upload Zone */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Upload Zone
            </h2>
            <Card className="w-full bg-card/60 backdrop-blur border-border/60 border-2 border-dashed transition-colors">
              <CardContent className="p-0">
                <div
                  className="p-6 sm:p-8 text-center space-y-4"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-medium text-foreground mb-1">
                      Drag & Drop Files Here
                    </p>
                    <p className="text-sm text-muted-foreground">or</p>
                  </div>
                  <Button
                    onClick={handleBrowseClick}
                    className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
                  >
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="pt-4 border-t border-border/40 text-left sm:text-center">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX (up to 20MB each)
                    </p>
                  </div>
                </div>

                {uploadErrors.length > 0 && (
                  <div className="border-t border-destructive/30 bg-destructive/10 px-4 sm:px-6 py-4 text-left">
                    <h3 className="text-sm font-semibold text-destructive mb-2">
                      Upload Errors
                    </h3>
                    <ul className="space-y-1 text-xs text-destructive">
                      {uploadErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {pendingUploads.length > 0 && (
                  <div className="border-t border-border/40 p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-left">
                      <h3 className="text-sm font-semibold text-foreground">
                        Uploading Files
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={markUploadDone}
                        disabled={
                          !pendingUploads.some(
                            (upload) => upload.status === "completed",
                          )
                        }
                        className="w-full sm:w-auto"
                      >
                        Done
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {pendingUploads.map((upload) => (
                        <div
                          key={upload.id}
                          className="border border-border rounded-lg p-4 bg-background/60"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground break-words">
                                {upload.file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 self-start rounded-full border border-border/60"
                              onClick={() => removePendingUpload(upload.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="w-full h-2 bg-border/40 rounded-full overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                upload.status === "completed"
                                  ? "bg-green-500"
                                  : "bg-primary"
                              }`}
                              style={{ width: `${upload.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {upload.status === "completed"
                              ? "Upload complete"
                              : `${Math.round(upload.progress)}%`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Document Library */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Document Library
            </h2>
            <div className="space-y-4">
              {documents.length === 0 ? (
                <div className="border border-border/60 rounded-lg bg-card/40 backdrop-blur p-6 sm:p-10 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No records uploaded
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a document to get started. Your files will show up
                    here once processed.
                  </p>
                </div>
              ) : (
                documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className="bg-card/60 backdrop-blur border-border/60 hover:bg-card/80 transition-colors cursor-pointer"
                    onClick={() =>
                      navigate(`/documents/${doc.id}`, {
                        state: { documents },
                      })
                    }
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground">
                              {doc.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Uploaded on {doc.uploadDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:self-start">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full border border-border/60 text-muted-foreground hover:text-foreground"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <Share className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <DropdownMenuItem
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleShareLink(doc);
                                }}
                              >
                                Share link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDownloadDocument(doc);
                                }}
                              >
                                Download summary (.txt)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button
                            aria-label="Delete document"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(doc.id);
                            }}
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full border border-border/60 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {doc.description}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
