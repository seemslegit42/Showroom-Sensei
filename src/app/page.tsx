"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeTab } from '@/components/welcome-tab';
import { InventoryTab } from '@/components/inventory-tab';
import { AnalyticsTab } from '@/components/analytics-tab';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Home, AreaChart, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/90 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary"/>
          <h1 className="text-xl font-bold font-headline">Showhome Sensei</h1>
        </div>
        <Avatar>
          <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="woman portrait" alt="Sales Host" />
          <AvatarFallback>SP</AvatarFallback>
        </Avatar>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <Tabs defaultValue="welcome" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3">
            <TabsTrigger value="welcome">
              <Users className="w-4 h-4 mr-2" />
              Welcome
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Home className="w-4 h-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <AreaChart className="w-4 h-4 mr-2" />
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
