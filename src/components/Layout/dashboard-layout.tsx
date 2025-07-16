import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { NewTournamentModal } from '@/components/Sidebar/new-tournament-modal';
import { useGeneralStore } from '@/stores/general';
import { useFetchTournaments } from '@/services/useTournaments';
import { Loading } from '@/components/Loading';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const getBreadcrumbItems = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  
  return paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`;
    const isLast = index === paths.length - 1;
    
    const titles: Record<string, string> = {
      'dashboard': 'Dashboard',
      'athletes': 'Atletas',
      'courses': 'Percursos',
      'categories': 'Categorias',
      'settings': 'Configurações',
      'ranking': 'Ranking',
      'cronometer': 'Cronometrar'
    };

    const title = titles[path] || path;

    return {
      href,
      title,
      isLast
    };
  });
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isModalOpen, setIsModalOpen } = useGeneralStore();
  const { isLoading } = useFetchTournaments();
  const { pathname } = useLocation();
  const breadcrumbItems = getBreadcrumbItems(pathname);

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
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((item) => (
                    <BreadcrumbItem key={item.href}>
                      {item.isLast ? (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={item.href}>{item.title}</Link>
                        </BreadcrumbLink>
                      )}
                      {!item.isLast && (
                        <BreadcrumbSeparator>
                          <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
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