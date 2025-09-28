import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesUploaded: (files: Array<{ id: number; title: string; uploadDate: string; description: string }>) => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export default function UploadModal({ open, onOpenChange, onFilesUploaded }: UploadModalProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 20MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file format. Only PDF, DOC, DOCX, TXT, XLS, XLSX files are allowed`;
    }

    return null;
  };

  const handleFiles = useCallback((files: FileList) => {
    setErrors([]);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (validFiles.length === 0) return;
    const newFiles = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((uploadFile) => {
      const interval = setInterval(() => {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, progress: Math.min(f.progress + Math.random() * 30, 100) }
              : f
          )
        );
      }, 200);

      // Complete upload after 2-4 seconds
      setTimeout(() => {
        clearInterval(interval);
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, progress: 100, status: "completed" }
              : f
          )
        );
      }, 2000 + Math.random() * 2000);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleFinishUpload = () => {
    const completedFiles = uploadFiles.filter((f) => f.status === "completed");
    const newDocuments = completedFiles.map((uploadFile, index) => ({
      id: Date.now() + index,
      title: uploadFile.file.name.replace(/\.[^/.]+$/, ""),
      uploadDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      description: `Uploaded ${uploadFile.file.type || "document"} file. Processing complete and ready for analysis.`,
    }));

    onFilesUploaded(newDocuments);
    setUploadFiles([]);
    onOpenChange(false);
    toast.success(`${completedFiles.length} file(s) uploaded successfully`);
  };

  const allCompleted = uploadFiles.length > 0 && uploadFiles.every((f) => f.status === "completed");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background border-border">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold text-foreground">Upload a Document</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Examples: Meeting transcripts, Lecture notes, Research papers, etc.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border bg-card/30"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Drag and drop a file here</h3>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <Button onClick={handleBrowseFiles} className="bg-primary text-white hover:bg-primary/90">
              Browse files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.xlsx"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="mt-4 pt-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground">
                Supported format: PDF (up to 20MB). Additional file formats will be supported in future updates.
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Uploading Files</h4>
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{uploadFile.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {uploadFile.status === "completed" && (
                        <span className="text-xs text-green-500 font-medium">Complete</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(uploadFile.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={uploadFile.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{Math.round(uploadFile.progress)}%</p>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {allCompleted && (
              <Button onClick={handleFinishUpload} className="bg-primary text-white hover:bg-primary/90">
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
