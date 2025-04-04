"use client"

import { NavSections } from "./nav-sections"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/auth"
import { useTournamentStore } from "@/stores/tournaments"

type AppSidebarProps = {
  setIsModalOpen: (isOpen: boolean) => void
}

export function AppSidebar({ setIsModalOpen, ...props }: AppSidebarProps) {
  const { user, logout } = useAuthStore()
  const { tournaments, currentTournament, setCurrentTournament } = useTournamentStore()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher tournaments={tournaments} activeTournament={currentTournament} setActiveTournament={setCurrentTournament} setIsModalOpen={setIsModalOpen} />
      </SidebarHeader>
      <SidebarContent>
        <NavSections currentTournament={currentTournament} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logout={logout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
