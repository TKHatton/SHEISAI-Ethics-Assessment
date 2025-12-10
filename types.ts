
export enum Page {
  HOME = 'home',
  PRINCIPLES = 'principles',
  FRAMEWORKS = 'frameworks',
  GLOBAL = 'global',
  RESOURCES = 'resources',
  TEAM = 'team',
  CHAT = 'chat',
  REGISTER = 'register'
}

export interface NavItem {
  id: Page;
  label: string;
}

export interface CoreValue {
  title: string;
  description: string;
  iconName: string;
}

export interface Pillar {
  title: string;
  description: string;
  link: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}
