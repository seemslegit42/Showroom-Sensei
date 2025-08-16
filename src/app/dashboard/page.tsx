
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeTab } from '@/components/welcome-tab';
import { InventoryTab } from '@/components/inventory-tab';
import { AnalyticsTab } from '@/components/analytics-tab';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Home, AreaChart, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DashboardPage() {
  const { user, logOut } = useAuth();
  const userName = user?.displayName || user?.email || "Sales Host";
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/90 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary"/>
          <h1 className="text-xl font-bold font-headline">Showhome Sensei</h1>
        </div>
        <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={logOut}>
                      <LogOut />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Avatar>
              <AvatarImage src={user?.photoURL ?? undefined} data-ai-hint="woman portrait" alt={userName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <Tabs defaultValue="welcome" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3">
            <TabsTrigger value="welcome">
              <Users />
              Welcome
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Home />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <AreaChart />
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="welcome" className="mt-6">
            <WelcomeTab />
          </TabsContent>
          <TabsContent value="inventory" className="mt-6">
            <InventoryTab />
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
