import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ServiceIntervals from "./pages/ServiceIntervals";
import CustomerJourney from "./pages/CustomerJourney";
import OilTypeSales from "./pages/OilTypeSales";
import DataCaptureLtv from "./pages/DataCaptureLtv";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reports/service-intervals" element={<ServiceIntervals />} />
          <Route path="/reports/customer-journey" element={<CustomerJourney />} />
          <Route path="/reports/oil-type-sales" element={<OilTypeSales />} />
          <Route path="/reports/data-capture-ltv" element={<DataCaptureLtv />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
