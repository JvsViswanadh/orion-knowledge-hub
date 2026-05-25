import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DocumentViewer from "./pages/DocumentViewer";

const App = () => {

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/orion-knowledge-hub/">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents/:documentId?" element={<DocumentViewer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
  
};

interface RootContainer extends HTMLElement {
  _reactRoot?: Root;
}

const rootElement = document.getElementById("root") as RootContainer | null;

if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

const root = rootElement._reactRoot ?? createRoot(rootElement);
rootElement._reactRoot = root;

root.render(<App />);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    root.unmount();
    delete rootElement._reactRoot;
  });
}