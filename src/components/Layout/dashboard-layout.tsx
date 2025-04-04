import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { NewTournamentModal } from '@/components/Sidebar/new-tournament-modal';
import { useGeneralStore } from '@/stores/general';
import { useFetchTournaments } from '@/services/useTournaments';
import { Loading } from '@/components/Loading';
import { useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const getPageTitle = (pathname: string) => {
  const path = pathname.split('/').pop();
  
  const titles: Record<string, string> = {
    'dashboard': 'Dashboard',
    'athletes': 'Atletas',
    'courses': 'Percursos',
    'categories': 'Categorias',
    'settings': 'Configurações',
    'ranking': 'Ranking'
  };

  return titles[path || 'dashboard'] || 'Dashboard';
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isModalOpen, setIsModalOpen } = useGeneralStore();
  const { isLoading } = useFetchTournaments();
  const { pathname } = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar setIsModalOpen={setIsModalOpen} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-lg font-semibold">{getPageTitle(pathname)}</h1>
            </div>
          </header>
          <div className="flex flex-col gap-4 p-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <NewTournamentModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
} 