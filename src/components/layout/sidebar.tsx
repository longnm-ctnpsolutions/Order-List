import { FileArchive, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
    return (
        <aside className="w-16 bg-white flex-col items-center py-4 hidden lg:flex">
            <div className="flex flex-col items-center space-y-6">
            <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
            </Button>
            <div className="p-2 bg-blue-100 rounded-lg">
                <FileArchive className="h-6 w-6 text-primary" />
            </div>
            </div>
      </aside>
    )
}
