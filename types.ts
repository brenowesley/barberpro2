
export enum PlanTier {
  FREE = 'FREE',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS',
}

export enum UserRole {
  PROVIDER = 'PROVIDER', // The hairdresser/barber
  CLIENT = 'CLIENT',     // The customer
  ADMIN = 'ADMIN',       // Platform admin
}

export interface PlanLimits {
  maxServices: number;
  maxPhotos: number;
  commissionRate: number; // Percentage taken from booking
  hasFinancialDashboard: boolean;
  hasCustomDomain: boolean;
  hasTeamManagement: boolean;
  hasAIReports: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description?: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  clientName: string;
  date: string; // ISO string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  price: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  plan: PlanTier;
  avatarUrl?: string;
  services: Service[];
  appointments: Appointment[];
  portfolioImages: string[];
  shopName?: string;
}

// Configuration for Feature Flags based on Plans
export const PLAN_CONFIGS: Record<PlanTier, PlanLimits> = {
  [PlanTier.FREE]: {
    maxServices: 5,
    maxPhotos: 10,
    commissionRate: 0, // 0% fee (Updated per user request)
    hasFinancialDashboard: false,
    hasCustomDomain: false,
    hasTeamManagement: false,
    hasAIReports: false,
  },
  [PlanTier.PRO]: {
    maxServices: 9999, // Unlimited
    maxPhotos: 9999,
    commissionRate: 0,
    hasFinancialDashboard: true,
    hasCustomDomain: true,
    hasTeamManagement: false,
    hasAIReports: true,
  },
  [PlanTier.BUSINESS]: {
    maxServices: 9999,
    maxPhotos: 9999,
    commissionRate: 0,
    hasFinancialDashboard: true,
    hasCustomDomain: true,
    hasTeamManagement: true,
    hasAIReports: true,
  },
};
