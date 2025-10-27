import React from 'react';
import type { IntegrationType } from '../types';
import { 
    StripeIcon 
} from './icons';

export interface Integration {
  id: IntegrationType;
  name: string;
  description: string;
  docsUrl: string;
  icon: React.FC<{ className?: string }>;
}

export const INTEGRATIONS: Integration[] = [
];