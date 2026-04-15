import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { AboutEditor } from "@/components/admin/AboutEditor";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { BlogManager } from "@/components/admin/BlogManager";
import { MessagesViewer } from "@/components/admin/MessagesViewer";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { PageMeta } from "@/components/seo/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <PageMeta title="Admin Dashboard" />
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="hero">
          <HeroEditor />
        </TabsContent>
        <TabsContent value="about">
          <AboutEditor />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsManager />
        </TabsContent>
        <TabsContent value="blog">
          <BlogManager />
        </TabsContent>
        <TabsContent value="messages">
          <MessagesViewer />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsPanel />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
