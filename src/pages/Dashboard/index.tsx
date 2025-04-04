import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { NewTournamentModal } from '@/components/Sidebar/new-tournament-modal';
import { useGeneralStore } from '@/stores/general';
import { useFetchTournaments } from '@/services/useTournaments';
import { Loading } from '@/components/Loading';

export default function DashboardPage() {
  const { isModalOpen, setIsModalOpen } = useGeneralStore();
  const { isLoading } = useFetchTournaments();

  return (
    isLoading ? (
      <Loading />
    ) : (
      <>
        <SidebarProvider>
          <AppSidebar setIsModalOpen={setIsModalOpen}/>
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
            </header>
          </SidebarInset>
        </SidebarProvider>
        <NewTournamentModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      </>
    )
  );
}