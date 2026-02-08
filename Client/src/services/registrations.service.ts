/**
 * Registrations Service
 * 
 * Handles event registration operations.
 */

import { api } from '@/lib/api-client';
import type {
  Registration,
  RegistrationWithEvent,
  RegistrationWithUser,
  RegistrationCreateRequest,
  RegistrationUpdateRequest,
} from '@/types/api';

export const registrationsService = {
  /**
   * Register for an event
   */
  create: async (data: RegistrationCreateRequest): Promise<Registration> => {
    return api.post<Registration>('/registrations', data);
  },

  /**
   * Get current user's registrations
   */
  getMyRegistrations: async (): Promise<RegistrationWithEvent[]> => {
    return api.get<RegistrationWithEvent[]>('/registrations');
  },

  /**
   * Get all registrations for an event (admin only)
   */
  getEventRegistrations: async (eventId: string): Promise<RegistrationWithUser[]> => {
    return api.get<RegistrationWithUser[]>(`/registrations/event/${eventId}`);
  },

  /**
   * Update registration status (admin only)
   */
  updateStatus: async (id: string, data: RegistrationUpdateRequest): Promise<Registration> => {
    return api.patch<Registration>(`/registrations/${id}`, data);
  },
};
