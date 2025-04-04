"use client"

import {
  UserRound,
  LandPlot,
  LayoutList,
  Medal,
  Settings,
  Timer
} from "lucide-react"

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
          <SidebarMenuButton disabled={!currentTournament}>
            <Timer />
            <span>Cronometrar</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton disabled={!currentTournament}>
            <Medal />
            <span>Ranking</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarGroupLabel>Cadastros</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton disabled={!currentTournament}>
            <UserRound />
            <span>Atletas</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton disabled={!currentTournament}>
            <LandPlot />
            <span>Percursos</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton disabled={!currentTournament}>
            <LayoutList />
            <span>Categorias</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarGroupLabel>Geral</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton disabled={!currentTournament}>
            <Settings />
            <span>Configurações</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
