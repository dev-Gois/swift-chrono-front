"use client"

import {
  UserRound,
  LandPlot,
  LayoutList,
  Medal,
  Settings,
  Timer
} from "lucide-react"
import { Link } from "react-router-dom"

import { Tournament } from "@/stores/tournaments/types"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

export function NavSections({ currentTournament }: { currentTournament: Tournament | null }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Cronometragem</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard/cronometer" className="w-full" aria-disabled={!currentTournament}>
              <Timer />
              <span>Cronometrar</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard/ranking" className="w-full" aria-disabled={!currentTournament}>
              <Medal />
              <span>Ranking</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarGroupLabel>Cadastros</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard/athletes" className="w-full" aria-disabled={!currentTournament}>
              <UserRound />
              <span>Atletas</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {/* <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard/courses" className="w-full" aria-disabled={!currentTournament}>
              <LandPlot />
              <span>Percursos</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard/categories" className="w-full" aria-disabled={!currentTournament}>
              <LayoutList />
              <span>Categorias</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarGroupLabel>Geral</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard/settings" className="w-full" aria-disabled={!currentTournament}>
              <Settings />
              <span>Configurações</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
