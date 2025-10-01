import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Share, Trash2, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

  const handleFilesUploaded = (newFiles: Document[]) => {
    setDocuments((prev) => [...newFiles, ...prev]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsUploadModalOpen(true);
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
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[400px,1fr] gap-8">
          {/* Upload Zone */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Upload Zone
            </h2>
            <Card
              className="bg-card/60 backdrop-blur border-border/60 border-2 border-dashed cursor-pointer hover:border-primary/60 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => setIsUploadModalOpen(true)}
            >
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-1">
                      Drag & Drop Files Here
                    </p>
                    <p className="text-sm text-muted-foreground">or</p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUploadModalOpen(true);
                    }}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Browse Files
                  </Button>
                  <div className="pt-4 border-t border-border/40">
                    <p className="text-xs text-muted-foreground">
                      Currently supported file types: PDF, DOCX, Word, Formats
                      (XLSX), TXT, Transcripts (Coming Soon)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Library */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Document Library
            </h2>
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="bg-card/60 backdrop-blur border-border/60 hover:bg-card/80 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/documents/${doc.id}`, {
                      state: { documents },
                    })
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                        <Button
                          aria-label="Delete document"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(doc.id);
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
              ))}
            </div>
          </div>
        </div>
      </main>

      <UploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onFilesUploaded={handleFilesUploaded}
      />
    </div>
  );
}
