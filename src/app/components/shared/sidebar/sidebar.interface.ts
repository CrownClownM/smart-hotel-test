export interface SidebarObject {
  admin: SidebarOption[];
  traveler: SidebarOption[];
}

export interface SidebarOption {
  label: string;
  icon: string;
  linkTo?: string;
  subItems?: subItemOption[];
  params?: Record<string, string>;
}

export interface subItemOption {
  label: string;
  icon: string;
  linkTo?: string;
  params?: Record<string, string>;
}
