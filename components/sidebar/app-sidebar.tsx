"use client"

import * as React from "react"
import {
    AudioWaveform,
    Command,
    Frame,
    GalleryVerticalEnd,
    HomeIcon,
    Map,
    Settings2,
    FilterIcon,
    BookIcon,
    Plus,
    List,
    PlusIcon,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavCommomItems } from "./nav-commom-items"
import { NavUser } from "./nav-user"
import Link from "next/link"
import { Button } from "../ui/button"


// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Imóveis",
            url: "/",
            icon: HomeIcon,
            isActive: true,
            items: [
                {
                    title: "Aluguel",
                    url: "/properties/rent",
                },
                {
                    title: "Venda",
                    url: "/properties/sale",
                },
            ],
        },
        {
            title: "Tema",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Claro",
                    url: "#",
                },
                {
                    title: "Escuro",
                    url: "#",
                },
                {
                    title: "Sistema",
                    url: "#",
                },
            ],
        },

    ],
    singleItems: [
        {
            name: "Consultas",
            url: "#",
            icon: BookIcon,
        },
        {
            name: "Filtros",
            url: "/filters",
            icon: FilterIcon,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
    jcsItems: [
        {
            name: "Cadastrar imóvel",
            url: "/properties/new",
            icon: PlusIcon,
        },
        {
            name: "Listar imóveis",
            url: "/properties",
            icon: List,
        },
        {
            name: "Listar Inquilinos",
            url: "/inquilinos",
            icon: List,
        },
        {
            name: "Listar Proprietários",
            url: "/proprietarios",
            icon: List,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const {
        open,
        isMobile
    } = useSidebar()

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {open || isMobile ? (
                    <span className="truncate text-lg ml-2">JCS Imóveis</span>
                ) : (
                    <span className="text-lg font-bold text-sidebar-primary text-center">J</span>
                )}

            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavCommomItems userItems={data.singleItems} />
                <NavCommomItems userItems={data.jcsItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
