import React from 'react';
import { AcracsInput } from './types';
import { WeightPresetProfile } from './types';

export const LOCATIONS = [
  { value: 'khulna', label: { en: 'Khulna (Coastal - Salinity, Cyclone)', bn: 'খুলনা (উপকূলীয় - লবণাক্ততা, ঘূর্ণিঝড়)' } },
  { value: 'rajshahi', label: { en: 'Rajshahi (Drought-prone)', bn: 'রাজশাহী (খরা-প্রবণ)' } },
  { value: 'sylhet', label: { en: 'Sylhet (Flash Floods)', bn: 'সিলেট (আকস্মিক বন্যা)' } },
  { value: 'chattogram_hills', label: { en: 'Chattogram Hill Tracts (Landslides)', bn: 'চট্টগ্রাম পার্বত্য অঞ্চল (ভূমিধস)' } },
  { value: 'haor_region', label: { en: 'Haor Region (Seasonal Flooding)', bn: 'হাওর অঞ্চল (মৌসুমী বন্যা)' } },
  { value: 'other', label: { en: 'Other', bn: 'অন্যান্য' } },
];

export const SECTORS = [
  { value: 'agriculture', label: { en: 'Farming (Crops, Vegetables)', bn: 'কৃষি (ফসল, শাকসবজি)' } },
  { value: 'fisheries', label: { en: 'Fishing & Fish Farming', bn: 'মৎস্য ও মাছ চাষ' } },
  { value: 'livestock', label: { en: 'Livestock & Poultry', bn: 'গবাদি পশু ও হাঁস-মুরগি' } },
  { value: 'crafts', label: { en: 'Handicrafts (e.g., weaving, pottery)', bn: 'হস্তশিল্প (যেমন, বুনন, মৃৎশিল্প)' } },
  { value: 'retail', label: { en: 'Small Shop / Retail', bn: 'ছোট দোকান / খুচরা' } },
  { value: 'services', label: { en: 'Services (e.g., repair, transport)', bn: 'পরিষেবা (যেমন, মেরামত, পরিবহন)' } },
  { value: 'other', label: { en: 'Other Business', bn: 'অন্যান্য ব্যবসা' } },
];

export const YEARS_IN_BUSINESS = [
    { value: '0-1', label: { en: 'New (0-1 Year)', bn: 'নতুন (০-১ বছর)' } },
    { value: '2-5', label: { en: 'Growing (2-5 Years)', bn: 'ক্রমবর্ধমান (২-৫ বছর)' } },
    { value: '5+', label: { en: 'Established (5+ Years)', bn: 'প্রতিষ্ঠিত (৫+ বছর)' } },
];

export const RESOURCE_DEPENDENCY = [
    { value: 'low', label: { en: 'Low (Not very dependent)', bn: 'কম (খুব বেশি নির্ভরশীল নয়)' } },
    { value: 'medium', label: { en: 'Medium (Somewhat dependent)', bn: 'মাঝারি (কিছুটা নির্ভরশীল)' } },
    { value: 'high', label: { en: 'High (Very dependent)', bn: 'উচ্চ (খুব বেশি নির্ভরশীল)' } },
];


// Base scores for Climate Vulnerability Index (lower is better, represents higher risk)
export const CVI_SCORES = {
  khulna: 75,
  rajshahi: 70,
  sylhet: 65,
  chattogram_hills: 68,
  haor_region: 72,
  other: 50,
};

// Points for each Adaptive Capacity Score measure. Total possible: 100
export const ACS_POINTS = {
  diversification: 10,
  climateSmartPractices: 10,
  protectiveInfrastructure: 15,
  microInsurance: 10,
  climateTraining: 5,
  hasSavings: 10,
  earlyWarningAccess: 5,
  communityGroupMember: 5,
  formalBusinessPlan: 10,
  localSupplierNetwork: 10,
  digitalLiteracy: 10,
};

// Points for Business Stability Score. Total possible: 100
export const STABILITY_POINTS = {
    years: {
        '0-1': 10,
        '2-5': 25,
        '5+': 40,
    },
    dependency: {
        low: 30,
        medium: 15,
        high: 5,
    },
    employees: 2, // 2 points per employee, will be capped
};

export const WOMAN_LED_BONUS_MULTIPLIER = 1.15; // 15% bonus to ACS score

const iconProps = {
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: "w-full h-full"
};

export const RESILIENCE_LABELS: Record<keyof AcracsInput['resilienceMeasures'], {label: {en: string, bn: string}, placeholder: {en: string, bn: string}, hasDetails: boolean, icon: React.ReactNode}> = {
    diversification: { 
        label: { en: 'Have multiple ways to earn money?', bn: 'টাকা আয়ের একাধিক উপায় আছে?' }, 
        placeholder: { en: 'E.g., sell vegetables, drive a rickshaw...', bn: 'যেমন, সবজি বিক্রি, রিকশা চালানো...' }, 
        hasDetails: true,
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' }))
    },
    climateSmartPractices: { 
        label: { en: 'Use climate-smart farming/business methods?', bn: 'জলবায়ু-সহনশীল কৃষি/ব্যবসা পদ্ধতি ব্যবহার করেন?' }, 
        placeholder: { en: 'E.g., use special seeds, save water...', bn: 'যেমন, বিশেষ বীজ ব্যবহার, জল সংরক্ষণ...' }, 
        hasDetails: true,
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-6.75 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }))
    },
    protectiveInfrastructure: { 
        label: { en: 'Invested in stronger structures (raised floors, etc.)?', bn: 'শক্তিশালী কাঠামোতে বিনিয়োগ করেছেন (যেমন উঁচু মেঝে)?' }, 
        placeholder: { en: 'E.g., raised shop floor, stronger roof...', bn: 'যেমন, দোকানের মেঝে উঁচু করা, শক্তিশালী ছাদ...' }, 
        hasDetails: true,
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5' }))
    },
    microInsurance: { 
        label: { en: 'Have business insurance for disasters?', bn: 'দুর্যোগের জন্য ব্যবসার বীমা আছে?' }, 
        placeholder: { en: '', bn: '' }, 
        hasDetails: false,
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z' }))
    },
    climateTraining: { 
        label: { en: 'Attended training on climate risks?', bn: 'জলবায়ু ঝুঁকি বিষয়ে প্রশিক্ষণ নিয়েছেন?' }, 
        placeholder: { en: '', bn: '' }, 
        hasDetails: false,
        // FIX: Replaced JSX with React.createElement and corrected malformed SVG path data.
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222' }))
    },
    hasSavings: { 
        label: { en: 'Keep savings for emergencies?', bn: 'জরুরী অবস্থার জন্য সঞ্চয় রাখেন?' }, 
        placeholder: { en: '', bn: '' }, 
        hasDetails: false,
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-.75m0 0v-.375c0-.621-.504-1.125-1.125-1.125H3.75m1.5-1.5N21 4.5l-5.625 3.375-5.625-3.375L3.75 4.5zM5.625 7.5L3 9m18-1.5l-2.625 1.5M12 13.5h0' }))
    },
    earlyWarningAccess: { 
        label: { en: 'Receive weather alerts (SMS, radio)?', bn: 'আবহাওয়ার সতর্কতা পান (এসএমএস, রেডিও)?' }, 
        placeholder: { en: '', bn: '' }, 
        hasDetails: false,
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0' }))
    },
    communityGroupMember: { 
        label: { en: 'Part of a local community group/cooperative?', bn: 'স্থানীয় কোনো দল/সমবায়ের অংশ?' }, 
        placeholder: { en: '', bn: '' }, 
        hasDetails: false,
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023.99-2.13.99-3.262a4.5 4.5 0 00-9 0c0 1.132.42 2.239.99 3.262m12.256 0H12v-1.5a4.5 4.5 0 00-9 0v1.5H2.25a1.125 1.125 0 01-1.125-1.125v-1.5c0-1.02.83-1.838 1.85-1.995a4.502 4.502 0 016.35 0c1.02.157 1.85.975 1.85 1.995v1.5h3.375c.621 0 1.125.504 1.125 1.125v1.5-1.125z' }))
    },
    formalBusinessPlan: { 
        label: { en: 'Have a written plan for your business?', bn: 'আপনার ব্যবসার জন্য একটি লিখিত পরিকল্পনা আছে?'}, 
        placeholder: { en: 'E.g., plan for growth, future sales goals...', bn: 'যেমন, প্রবৃদ্ধির পরিকল্পনা, ভবিষ্যতের বিক্রয়ের লক্ষ্য...'}, 
        hasDetails: true,
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }))
    },
    localSupplierNetwork: { 
        label: { en: 'Have a strong network of local suppliers?', bn: 'স্থানীয় সরবরাহকারীদের একটি শক্তিশালী নেটওয়ার্ক আছে?'}, 
        placeholder: { en: 'E.g., buy materials from multiple local shops...', bn: 'যেমন, একাধিক স্থানীয় দোকান থেকে উপকরণ কেনা...'}, 
        hasDetails: true,
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244' }))
    },
    digitalLiteracy: { 
        label: { en: 'Use digital tools (mobile banking, online sales)?', bn: 'ডিজিটাল টুল ব্যবহার করেন (মোবাইল ব্যাংকিং, অনলাইন বিক্রয়)?'}, 
        placeholder: { en: 'E.g., use bKash, sell on Facebook...', bn: 'যেমন, বিকাশ ব্যবহার, ফেসবুকে বিক্রি...'}, 
        hasDetails: true,
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file
        icon: React.createElement('svg', iconProps, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3' }))
    },
  };

export const WEIGHT_PRESETS: Record<WeightPresetProfile, { financial: number; stability: number; cvi: number; acs: number; }> = {
  highClimateRisk: { financial: 0.15, stability: 0.10, cvi: 0.40, acs: 0.35 },
  establishedStable: { financial: 0.35, stability: 0.30, cvi: 0.15, acs: 0.20 },
  newVenture: { financial: 0.20, stability: 0.15, cvi: 0.30, acs: 0.35 },
  balanced: { financial: 0.25, stability: 0.15, cvi: 0.30, acs: 0.30 },
};

// Define high-risk categories for automatic weighting
export const HIGH_RISK_LOCATIONS = ['khulna', 'sylhet', 'haor_region'];
export const HIGH_RISK_SECTORS = ['agriculture', 'fisheries'];
export const LOW_RISK_SECTORS = ['retail', 'services', 'crafts', 'other', 'livestock'];