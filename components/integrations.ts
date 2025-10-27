import React from 'react';
import type { IntegrationType } from '../types';
import {
    OpenAIIcon,
    Auth0Icon,
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
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Connect your OpenAI API key for advanced AI features',
    docsUrl: 'https://platform.openai.com/docs',
    icon: OpenAIIcon,
  },
  {
    id: 'auth0',
    name: 'Auth0',
    description: 'Configure Auth0 OAuth integration for user authentication',
    docsUrl: 'https://auth0.com/docs',
    icon: Auth0Icon,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Set up Stripe for payment processing and subscription management',
    docsUrl: 'https://stripe.com/docs',
    icon: StripeIcon,
  },
];
