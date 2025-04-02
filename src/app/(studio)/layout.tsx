import StudioNavbar from "@/components/studio/studio-navbar";
import StudioSidebar from "@/components/studio/studio-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar"; 
import { getUser } from "@/lib/auth-session";


export default async function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 const user = await getUser();
if (!user) {
  return <div>Unauthorized</div>; // ✅ Handle missing user properly
}

  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSidebar user={{ ...user, image: user.image ?? null }}/>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}