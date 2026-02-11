import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsService } from '@/services';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import type { EventWithParticipants } from '@/types/api';
import Navbar from '@/components/Navbar';

export default function Events() {
  const [events, setEvents] = useState<EventWithParticipants[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  // Add Luma event data
  const lumaEvent: EventWithParticipants = {
    id: 'luma-code4cause-2025',
    title: 'Code4Cause: Social Impact Hackathon',
    description: 'Ready to Ignite Change? Step up and code for a cause! The Social Impact Hackathon isn\'t just an event; it\'s a movement. In this adrenaline-fueled 7-hour sprint, we\'re bridging the gap between technology and humanity. Whether you\'re a coding wizard, a design visionary, or a strategic thinker, your skills have the power to solve real-world crises.',
    start_date: '2025-02-21T09:00:00+05:30',
    end_date: '2025-02-21T16:15:00+05:30',
    location: 'Computer Seminar Hall | GIDC Degree Engineering College, Abrama, Gujarat',
    max_participants: 200,
    participant_count: 45,
    status: 'live',
    image_urls: ['/luma.png'],
    registration_open: true,
    prizes: {
      '1st': '5K INR',
      '2nd': '3K INR', 
      '3rd': '1K INR'
    },
    themes: ['Social Impact'],
    created_at: '2025-02-15T00:00:00+05:30'
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Only show Luma event
      const allEvents = [lumaEvent];
      
      // Filter based on selected filter
      const filteredEvents = filter === 'all' 
        ? allEvents 
        : allEvents.filter(event => event.status === filter);
      
      setEvents(filteredEvents);
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: 'Error',
          description: 'Failed to load events',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      live: 'default',
      upcoming: 'secondary',
      past: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Hackathon Events</h1>
          <p className="text-muted-foreground">
            Browse and register for upcoming hackathons
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Events
          </Button>
          <Button
            variant={filter === 'live' ? 'default' : 'outline'}
            onClick={() => setFilter('live')}
          >
            Live
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'past' ? 'default' : 'outline'}
            onClick={() => setFilter('past')}
          >
            Past
          </Button>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <p className="text-muted-foreground">No events found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {events.map((event) => (
              <Card key={event.id} className={`flex flex-col ${event.id === 'luma-code4cause-2024' ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                {event.image_urls && event.image_urls.length > 0 && (
                  <div className="h-32 overflow-hidden rounded-t-lg relative">
                    <img
                      src={event.image_urls[0]}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {event.id === 'luma-code4cause-2024' && (
                      <div className="absolute top-1 right-1 bg-blue-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                        LIVE
                      </div>
                    )}
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-2 mb-1">
                    <CardTitle className="text-sm font-semibold line-clamp-1">
                      {event.title}
                      {event.id === 'luma-code4cause-2024' && (
                        <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded">
                          Luma
                        </span>
                      )}
                    </CardTitle>
                    {getStatusBadge(event.status)}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 py-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(event.start_date)}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        {event.participant_count}/{event.max_participants}
                      </div>
                      {event.id === 'luma-code4cause-2024' && event.prizes && (
                        <div className="flex items-center text-green-600 font-semibold">
                          <span className="mr-1">🏆</span>
                          {event.prizes['1st']}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  {event.id === 'luma-code4cause-2024' ? (
                    <a 
                      href="https://luma.com/0hmim4ly" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs">
                        Register
                      </Button>
                    </a>
                  ) : (
                    <Link to={`/events/${event.id}`} className="w-full">
                      <Button size="sm" className="w-full text-xs">
                        View
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
