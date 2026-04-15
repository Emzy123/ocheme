import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { deleteMessage, listMessages, updateMessageStatus } from "@/services/adminApi";
import { useAuth } from "@/context/AuthContext";
import type { ContactMessage } from "@/types";
import { toast } from "sonner";
import { useState } from "react";

function toCsv(rows: ContactMessage[]): string {
  const headers = ["name", "email", "subject", "date", "status", "message"];
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...rows.map((m) =>
      [
        m.name,
        m.email,
        m.subject ?? "",
        new Date(m.createdAt).toISOString(),
        m.status,
        m.message,
      ]
        .map((c) => esc(String(c)))
        .join(",")
    ),
  ];
  return lines.join("\n");
}

export function MessagesViewer() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => listMessages(token!),
    enabled: Boolean(token),
  });

  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const updateMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "read" | "unread" }) =>
      updateMessageStatus(token!, id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteMessage(token!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.success("Message deleted");
      setSelected(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function exportCsv() {
    const blob = new Blob([toCsv(messages)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-messages-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <CardTitle>Contact messages</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={exportCsv} disabled={!messages.length}>
          <Download className="mr-1 h-4 w-4" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((m) => (
                <TableRow key={m._id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="max-w-[140px] truncate">{m.email}</TableCell>
                  <TableCell className="max-w-[120px] truncate">{m.subject ?? "—"}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(m.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.status === "unread" ? "neon" : "outline"}>{m.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelected(m)}
                      aria-label="View message"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        updateMut.mutate({
                          id: m._id,
                          status: m.status === "read" ? "unread" : "read",
                        })
                      }
                      aria-label="Toggle read"
                    >
                      {m.status === "read" ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm("Delete this message?")) delMut.mutate(m._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message from {selected?.name}</DialogTitle>
            </DialogHeader>
            {selected ? (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Email:</span> {selected.email}
                </p>
                {selected.subject ? (
                  <p>
                    <span className="text-muted-foreground">Subject:</span> {selected.subject}
                  </p>
                ) : null}
                <p className="whitespace-pre-wrap rounded-md border border-white/10 bg-black/40 p-3">
                  {selected.message}
                </p>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
