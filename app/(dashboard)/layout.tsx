import Header from "@/components/Header"

type DashboardLayoutProps = {
    children: React.ReactNode
}

const DashboardLayout = ({children}:DashboardLayoutProps) =>{
    return (
        <>
            <Header />
            <main className="px-3 lg:px-14">
                {children}
            </main>
        </>
    )
}

export default DashboardLayout