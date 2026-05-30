import { useState, useRef } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Paperclip,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  Download,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

const fmtSize = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
};

const iconFor = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.includes("pdf") || type.includes("text")) return FileText;
  return FileIcon;
};

export default function Appointment() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    office: "",
    date: "",
    time: "",
    duration: "30",
    type: "",
    notes: "",
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Appointment", href: "/appointment" },
  ];

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Attachment[] = Array.from(files).map((f) => ({
      id: `${Date.now()}-${f.name}`,
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
      url: URL.createObjectURL(f),
    }));
    setAttachments((prev) => [...prev, ...next]);
    toast({ title: "Files attached", description: `${next.length} file(s) added.` });
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient || !form.date || !form.time) {
      toast({ title: "Missing fields", description: "Patient, date and time are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Appointment saved", description: `${attachments.length} attachment(s) included.` });
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">New Appointment</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Schedule an appointment and attach related documents.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: appointment details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="section-header rounded-t-xl flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Appointment Details
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="patient" className="text-xs font-medium">
                      <User className="w-3 h-3 inline mr-1" /> Patient
                    </Label>
                    <Input
                      id="patient"
                      placeholder="Search patient by name or ID..."
                      value={form.patient}
                      onChange={(e) => setForm({ ...form, patient: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium">
                      <Stethoscope className="w-3 h-3 inline mr-1" /> Doctor
                    </Label>
                    <Select value={form.doctor} onValueChange={(v) => setForm({ ...form, doctor: v })}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                        <SelectItem value="dr-jones">Dr. Jones</SelectItem>
                        <SelectItem value="dr-patel">Dr. Patel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium">
                      <Building2 className="w-3 h-3 inline mr-1" /> Office
                    </Label>
                    <Select value={form.office} onValueChange={(v) => setForm({ ...form, office: v })}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select office" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Main Clinic</SelectItem>
                        <SelectItem value="north">North Branch</SelectItem>
                        <SelectItem value="south">South Branch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date" className="text-xs font-medium">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="time" className="text-xs font-medium">
                      <Clock className="w-3 h-3 inline mr-1" /> Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium">Duration (min)</Label>
                    <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["15", "30", "45", "60", "90"].map((d) => (
                          <SelectItem key={d} value={d}>{d} min</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium">Appointment Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkup">Checkup</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="filling">Filling</SelectItem>
                        <SelectItem value="extraction">Extraction</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add clinical notes, instructions, or other relevant information..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="mt-1.5 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: attachments */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="section-header rounded-t-xl flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Attachments
                  {attachments.length > 0 && (
                    <span className="ml-auto text-xs bg-section-header-foreground/15 px-2 py-0.5 rounded-full">
                      {attachments.length}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleFiles(e.dataTransfer.files);
                    }}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all",
                      dragOver
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-accent/30"
                    )}
                  >
                    <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5 text-action-icon" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Drop files here or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      X-rays, consent forms, photos — up to 10 MB each
                    </p>
                    <input
                      ref={inputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>

                  {/* List */}
                  {attachments.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No attachments yet.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {attachments.map((a) => {
                        const Icon = iconFor(a.type);
                        return (
                          <li
                            key={a.id}
                            className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted transition-colors"
                          >
                            <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                              <Icon className="w-4 h-4 text-action-icon" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                              <p className="text-xs text-muted-foreground">{fmtSize(a.size)}</p>
                            </div>
                            <a
                              href={a.url}
                              download={a.name}
                              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => removeAttachment(a.id)}
                              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full gap-2">
                  <Save className="w-4 h-4" />
                  Save Appointment
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}