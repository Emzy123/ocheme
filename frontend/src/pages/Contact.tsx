import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageMeta } from "@/components/seo/PageMeta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/services/api";
import { toast } from "sonner";
import { Github, Linkedin, Mail, MapPin, Twitter } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: () => submitContact({ name, email, subject: subject || undefined, message }),
    onSuccess: () => {
      toast.success("Thank you for reaching out. I'll get back to you within 48 hours.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <Layout>
      <PageMeta title="Contact" description="Collaborations, speaking, and consulting — get in touch." />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2 sm:px-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-gold sm:text-5xl">Let's connect</h1>
          <p className="mt-4 text-muted-foreground">
            Open for collaborations, speaking engagements, and consulting. Send a message and I'll respond
            within 48 hours.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-neon" />
              <div>
                <p className="font-medium text-foreground">Email</p>
                <a href="mailto:emmanuel@quantrolabs.com" className="text-muted-foreground hover:text-neon">
                  emmanuel@quantrolabs.com
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-neon" />
              <div>
                <p className="font-medium text-foreground">Location</p>
                <p className="text-muted-foreground">Africa (remote)</p>
              </div>
            </li>
          </ul>
          <div className="mt-8 flex gap-4">
            <a
              href="https://twitter.com/EmmanuelOcheme"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-neon"
              aria-label="Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com/in/emmanuel-ocheme"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-neon"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="https://github.com/emmanuel-ocheme"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-neon"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject (optional)</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
                {mutation.isPending ? "Sending…" : "Send Message →"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
