'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Leaf, TestTube2, Stethoscope } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/crop-recommendation', label: 'Crop Recommendation', icon: Leaf },
  { href: '/fertilizer-recommendation', label: 'Fertilizer Guide', icon: TestTube2 },
  { href: '/disease-diagnosis', label: 'Disease Diagnosis', icon: Stethoscope },
];

export function NavItems() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="md:hidden">
        <SidebarTrigger />
      </SidebarMenuItem>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
              className="justify-start"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
