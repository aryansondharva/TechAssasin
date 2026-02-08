/**
 * Events Service
 * 
 * Handles event-related operations including listing, creating, updating, and deleting events.
 */

import { api } from '@/lib/api-client';
import type {
  Event,
  EventWithParticipants,
  EventCreateRequest,
  EventUpdateRequest,
  EventFilterParams,
  EventImageUploadResponse,
  PaginatedResponse,
} from '@/types/api';

export const eventsService = {
  /**
   * Get list of events with optional filters
   */
  list: async (params?: EventFilterParams): Promise<PaginatedResponse<EventWithParticipants>> => {
    return api.get<PaginatedResponse<EventWithParticipants>>('/events', params);
  },

  /**
   * Get a single event by ID
   */
  getById: async (id: string): Promise<EventWithParticipants> => {
    return api.get<EventWithParticipants>(`/events/${id}`);
  },

  /**
   * Create a new event (admin only)
   */
  create: async (data: EventCreateRequest): Promise<Event> => {
    return api.post<Event>('/events', data);
  },

  /**
   * Update an existing event (admin only)
   */
  update: async (id: string, data: EventUpdateRequest): Promise<Event> => {
    return api.patch<Event>(`/events/${id}`, data);
  },

  /**
   * Delete an event (admin only)
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/events/${id}`);
  },

  /**
   * Upload images for an event (admin only)
   */
  uploadImages: async (id: string, files: File[]): Promise<EventImageUploadResponse> => {
    // Upload files one by one
    const uploadPromises = files.map(file => 
      api.upload<{ image_url: string }>(`/events/${id}/images`, file, 'image')
    );
    
    const results = await Promise.all(uploadPromises);
    const image_urls = results.map(r => r.image_url);
    
    return { image_urls };
  },
};
