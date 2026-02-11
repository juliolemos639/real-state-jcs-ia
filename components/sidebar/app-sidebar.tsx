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
    BookIcon
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
    useritems: [
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
                <NavCommomItems userItems={data.useritems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
