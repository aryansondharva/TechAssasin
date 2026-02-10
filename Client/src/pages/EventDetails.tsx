import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsService, registrationsService, authService } from '@/services';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, Calendar, MapPin, Users, Trophy, Tag, ArrowLeft } from 'lucide-react';
import type { EventWithParticipants } from '@/types/api';
import Navbar from '@/components/Navbar';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventWithParticipants | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    team_name: '',
    project_idea: '',
  });

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const data = await eventsService.getById(id);
      setEvent(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: 'Error',
          description: 'Failed to load event details',
          variant: 'destructive',
        });
        navigate('/events');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (!authService.isAuthenticated()) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to register for events',
        variant: 'destructive',
      });
      navigate('/signin');
      return;
    }

    if (!event?.registration_open) {
      toast({
        title: 'Registration Closed',
        description: 'Registration is not open for this event',
        variant: 'destructive',
      });
      return;
    }

    setShowRegistrationForm(true);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // Validation
    if (!formData.team_name.trim() || !formData.project_idea.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (formData.project_idea.length < 10) {
      toast({
        title: 'Validation Error',
        description: 'Project idea must be at least 10 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const registration = await registrationsService.create({
        event_id: id,
        team_name: formData.team_name,
        project_idea: formData.project_idea,
      });

      toast({
        title: 'Registration Successful! 🎉',
        description: `Your registration status is: ${registration.status.toUpperCase()}`,
      });

      setShowRegistrationForm(false);
      setFormData({ team_name: '', project_idea: '' });
      
      // Refresh event to update participant count
      fetchEvent();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          toast({
            title: 'Already Registered',
            description: 'You have already registered for this event',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Registration Failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      live: 'default',
      upcoming: 'secondary',
      past: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'default'} className="text-lg px-4 py-1">
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Event not found</p>
      </div>
    );
  }

  const isFull = event.participant_count >= event.max_participants;
  const canRegister = event.registration_open && event.status !== 'past';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <Button
          variant="ghost"
          onClick={() => navigate('/events')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card>
              {event.image_urls && event.image_urls.length > 0 && (
                <div className="h-64 overflow-hidden rounded-t-lg">
                  <img
                    src={event.image_urls[0]}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-3xl">{event.title}</CardTitle>
                  {getStatusBadge(event.status)}
                </div>
                <CardDescription className="text-base">
                  {event.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p className="text-muted-foreground">{formatDate(event.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">End Date</p>
                    <p className="text-muted-foreground">{formatDate(event.end_date)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Participants</p>
                    <p className="text-muted-foreground">
                      {event.participant_count} / {event.max_participants} registered
                      {isFull && <span className="text-destructive ml-2">(FULL)</span>}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Themes */}
            {event.themes && event.themes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="mr-2 h-5 w-5" />
                    Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.themes.map((theme, index) => (
                      <Badge key={index} variant="secondary">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prizes */}
            {event.prizes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Prizes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(event.prizes, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.status === 'past' ? (
                  <p className="text-muted-foreground">This event has ended</p>
                ) : !event.registration_open ? (
                  <p className="text-muted-foreground">Registration is closed</p>
                ) : isFull ? (
                  <>
                    <p className="text-destructive font-medium">Event is full</p>
                    <p className="text-sm text-muted-foreground">
                      You can still register to be added to the waitlist
                    </p>
                    <Button onClick={handleRegisterClick} className="w-full">
                      Join Waitlist
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {event.max_participants - event.participant_count} spots remaining
                    </p>
                    <Button onClick={handleRegisterClick} className="w-full" size="lg">
                      Register Now
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Registration Form Dialog */}
      <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register for {event.title}</DialogTitle>
            <DialogDescription>
              Fill in your details to register for this hackathon
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team_name">Team Name *</Label>
              <Input
                id="team_name"
                placeholder="Enter your team name"
                value={formData.team_name}
                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_idea">Project Idea *</Label>
              <Textarea
                id="project_idea"
                placeholder="Describe your project idea (minimum 10 characters)"
                value={formData.project_idea}
                onChange={(e) => setFormData({ ...formData, project_idea: e.target.value })}
                disabled={isSubmitting}
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.project_idea.length} characters
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegistrationForm(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
