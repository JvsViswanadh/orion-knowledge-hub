import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Home,
  Settings,
  HelpCircle,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Upload,
  Send,
  Download,
  Star,
  X,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import UploadModal from "@/components/UploadModal";

interface Document {
  id: number;
  title: string;
  uploadDate: string;
  description: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
  highlighted?: boolean;
}

function DocumentContent({ document }: { document: Document }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        {document.title}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Uploaded on {document.uploadDate}
      </p>

      <div className="space-y-6 text-foreground">
        <p>
          This document presents a comprehensive analysis of market trends,
          consumer behavior, and competitive landscape for the third quarter of
          2023. Our findings are based on extensive data collection.
        </p>

        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>

        <p className="text-muted-foreground">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum.
        </p>

        <p className="text-muted-foreground italic">
          [Simulated PDF content continues...]
        </p>
      </div>
    </>
  );
}

export default function DocumentViewer() {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const location = useLocation();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isViewerExpanded, setIsViewerExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "user",
      message: "What was the main driver for Product X's growth?",
      highlighted: false,
    },
    {
      id: "msg-2",
      role: "assistant",
      message: "The #GrowForward social media campaign was the primary driver.",
    },
  ]);

  useEffect(() => {
    const storedDocs =
      location.state?.documents ||
      JSON.parse(localStorage.getItem("documents") || "[]");

    setDocuments(storedDocs);

    if (storedDocs.length === 0) {
      setCurrentDocument(null);
      return;
    }

    if (documentId) {
      const selected = storedDocs.find(
        (doc: Document) => doc.id === Number(documentId),
      );
      setCurrentDocument(selected || storedDocs[0]);
    } else {
      setCurrentDocument(storedDocs[0]);
    }
  }, [documentId, location.state]);

  useEffect(() => {
    if (!isViewerExpanded) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsViewerExpanded(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isViewerExpanded]);

  const highlightedCount = useMemo(
    () => chatMessages.filter((message) => message.highlighted).length,
    [chatMessages],
  );

  const handleFilesUploaded = (newFiles: Document[]) => {
    if (newFiles.length === 0) return;

    const updatedDocs = [...newFiles, ...documents];
    setDocuments(updatedDocs);
    localStorage.setItem("documents", JSON.stringify(updatedDocs));

    setCurrentDocument(newFiles[0]);
    navigate(`/documents/${newFiles[0].id}`, {
      state: { documents: updatedDocs },
      replace: true,
    });
  };

  const handleDocumentClick = (doc: Document) => {
    setCurrentDocument(doc);
    setIsViewerExpanded(false);
    navigate(`/documents/${doc.id}`, {
      state: { documents },
      replace: true,
    });
  };

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role: "user",
      message: trimmed,
      highlighted: false,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          role: "assistant",
          message: "I'm analyzing the document to provide you with an answer.",
        },
      ]);
    }, 1000);
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting to ${format}...`);
  };

  const toggleHighlight = (id: string) => {
    setChatMessages((prev) =>
      prev.map((message) =>
        message.id === id
          ? { ...message, highlighted: !message.highlighted }
          : message,
      ),
    );
  };

  return (
    <>
      <div className="min-h-screen orion-bg flex w-full overflow-hidden">
        <aside className="w-[200px] shrink-0 bg-[#0A1628] border-r border-border/20 flex flex-col">
          <div className="p-4 flex items-center gap-2">
            <div className="w-5 h-5 bg-primary rounded">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full text-white"
              >
                <rect width="24" height="24" rx="4" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">Orion</span>
          </div>

          <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-white hover:bg-white/10"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="w-4 h-4 mr-3" />
              Dashboard
            </Button>

            <div>
              <Button
                variant="ghost"
                className="w-full justify-between text-primary bg-primary/10 hover:bg-primary/20"
                onClick={() => setIsDocumentsOpen((open) => !open)}
              >
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-3" />
                  Documents
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isDocumentsOpen ? "rotate-180" : ""}`}
                />
              </Button>

              {isDocumentsOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleDocumentClick(doc)}
                      className={`w-full text-left text-xs py-2 px-3 rounded truncate transition-colors ${
                        currentDocument?.id === doc.id
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                      title={doc.title}
                    >
                      {doc.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="p-3 space-y-1 border-t border-border/20">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              onClick={() => navigate("/login")}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Log Out
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-white hover:bg-white/10"
            >
              <HelpCircle className="w-4 h-4 mr-3" />
              Help & Support
            </Button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="h-14 px-6 flex items-center justify-between border-b border-border/20 bg-background/50 backdrop-blur">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setZoomLevel((value) => Math.max(50, value - 10))
                }
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-foreground">
                {zoomLevel}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setZoomLevel((value) => Math.min(200, value + 10))
                }
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => currentDocument && setIsViewerExpanded(true)}
                disabled={!currentDocument}
                title="Expand"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Upload className="w-4 h-4 mr-2" />
              New Upload
            </Button>
          </div>

          <div className="flex-1 min-h-0 overflow-auto p-6">
            {currentDocument ? (
              <Card className="w-full max-w-4xl mx-auto bg-card/60 backdrop-blur border-border/60">
                <CardContent
                  className="p-8"
                  style={{ fontSize: `${zoomLevel}%`, lineHeight: "1.5" }}
                >
                  <DocumentContent document={currentDocument} />
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    No document selected
                  </p>
                  <Button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Upload Document
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>

        <aside className="w-[360px] shrink-0 bg-background/95 border-l border-border/20 flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">
              AI Insights
            </h2>

            <Accordion type="multiple" defaultValue={["summary", "qa"]}>
              <AccordionItem value="summary">
                <AccordionTrigger className="text-foreground hover:no-underline">
                  Quick Summary
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  The report shows a 25% increase in market share for Product X,
                  driven by a successful social media campaign. Consumer
                  sentiment has improved substantially with a focus on product
                  innovation. The company's leading product value to outclass
                  marketing trends.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="detailed">
                <AccordionTrigger className="text-foreground hover:no-underline">
                  Detailed Summary
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    The market research for Q3 2023 reveals significant trends
                    across multiple sectors. Key findings include:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>25% growth in Product X market share</li>
                    <li>Consumer sentiment improved by 18%</li>
                    <li>Social media campaign ROI exceeded targets by 40%</li>
                    <li>
                      Competitive landscape analysis shows strong positioning
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="qa">
                <AccordionTrigger className="text-foreground hover:no-underline">
                  <div className="flex items-center gap-2">
                    Q&A Chatbox
                    {highlightedCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary">
                        {highlightedCount} starred
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="h-[200px] overflow-y-auto space-y-3 mb-4 pr-1">
                      {chatMessages.map((message) => {
                        const isUser = message.role === "user";
                        return (
                          <div
                            key={message.id}
                            className={`rounded-lg border p-3 transition-colors ${
                              message.highlighted
                                ? "border-primary/50 bg-primary/10"
                                : "border-border/40 bg-background/60"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">
                                  {isUser ? "You" : "AI"}
                                </p>
                                <p className="text-xs leading-relaxed text-foreground">
                                  {message.message}
                                </p>
                              </div>
                              {isUser && (
                                <button
                                  type="button"
                                  aria-label={
                                    message.highlighted
                                      ? "Remove highlight"
                                      : "Highlight this question"
                                  }
                                  aria-pressed={message.highlighted}
                                  onClick={() => toggleHighlight(message.id)}
                                  className="p-1 rounded-full text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Star
                                    className="w-4 h-4"
                                    fill={
                                      message.highlighted
                                        ? "currentColor"
                                        : "none"
                                    }
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Ask the AI..."
                        value={chatInput}
                        onChange={(event) => setChatInput(event.target.value)}
                        onKeyDown={(event) =>
                          event.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1 bg-background border-border"
                      />
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="pt-6 border-t border-border/20">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Export Options
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Export includes Quick Summary, Detailed Summary and any Q&A
                answers you have starred.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExport("Word")}
                  className="flex flex-col items-center py-3 h-auto"
                >
                  <Download className="w-4 h-4 mb-1" />
                  <span className="text-xs">Word</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("Notion")}
                  className="flex flex-col items-center py-3 h-auto"
                >
                  <Download className="w-4 h-4 mb-1" />
                  <span className="text-xs">Notion</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("PDF")}
                  className="flex flex-col items-center py-3 h-auto"
                >
                  <Download className="w-4 h-4 mb-1" />
                  <span className="text-xs">PDF</span>
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {isViewerExpanded && currentDocument && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/20">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {currentDocument.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                Press Esc or click close to exit full screen
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsViewerExpanded(false)}
              aria-label="Close full screen viewer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-8">
            <div className="w-full max-w-5xl mx-auto bg-card/80 border border-border/60 rounded-2xl shadow-lg">
              <div
                className="p-8"
                style={{ fontSize: `${zoomLevel}%`, lineHeight: "1.5" }}
              >
                <DocumentContent document={currentDocument} />
              </div>
            </div>
          </div>
        </div>
      )}

      <UploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onFilesUploaded={handleFilesUploaded}
      />
    </>
  );
}
