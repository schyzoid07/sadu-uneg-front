import * as React from "react";

import { 
  User, 
  UserRoundCheck, // Profesores
  Medal, // Disciplinas
  Shield, // Equipos
  Library, // Universidades
  GraduationCap, // Carreras
  Trophy, // Torneos
  ChevronRight
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("atleta")) return <User className="size-5" />;
  if (t.includes("profesor")) return <UserRoundCheck className="size-5" />;
  if (t.includes("disciplina")) return <Medal className="size-5" />;
  if (t.includes("equipo")) return <Shield className="size-5" />;
  if (t.includes("universidad")) return <Library className="size-5" />;
  if (t.includes("carrera")) return <GraduationCap className="size-5" />;
  if (t.includes("torneo")) return <Trophy className="size-5" />;
  return <ChevronRight className="size-5" />;
};
// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Secciones",
      url: "#",
      items: [
        {
          title: "Inicio",
          url: "/",
        },
        {
          title: "Atletas",
          url: "/atletas",
        },
        {
          title: "Profesores",
          url: "/profesores",
        },
        {
          title: "Equipos",
          url: "/equipos",
        },
        {
          title: "Disciplinas",
          url: "/disciplinas",
        },
        {
          title: "Eventos",
          url: "/eventos",
        },
        {
          title: "Universidad",
          url: "/universidad",
        },
        {
          title: "Carreras",
          url: "/carreras",
        },
        { /*
          title: "Torneos",
          url: "/torneos",
        */},
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="bg-[#2b50aa] text-white border-r-0">

      <SidebarContent className="bg-[#2b50aa] ">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-white/50">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:bg-white hover:text-black transition-all duration-200 rounded-lg py-6">
                      <a href={item.url} className="flex items-center gap-4">
                        {getIcon(item.title)}
                        <span className="font-bold text-sm uppercase">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
