'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Phone regex for US/CA numbers
const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

const ticketFormSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    emailConfirm: z.string().email('Please enter a valid email'),
    phone: z.string().regex(phoneRegex, 'Please enter a valid phone number'),
    ticketCount: z.number().min(1).max(10, 'Maximum 10 tickets per order'),
    isGift: z.boolean().default(false),
    recipientFirstName: z.string().optional(),
    recipientLastName: z.string().optional(),
  })
  .refine((data) => data.email === data.emailConfirm, {
    message: "Emails don't match",
    path: ['emailConfirm'],
  })
  .refine(
    (data) => {
      if (data.isGift) {
        return data.recipientFirstName && data.recipientLastName;
      }
      return true;
    },
    {
      message: 'Recipient information is required when sending as a gift',
      path: ['recipientFirstName'],
    }
  );

type TicketFormValues = z.infer<typeof ticketFormSchema>;

const TicketsForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TicketFormValues>({
    // The zodResolver has a known type issue with complex Zod schemas
    resolver: zodResolver(ticketFormSchema) as unknown as Resolver<
      TicketFormValues,
      unknown
    >,
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      emailConfirm: '',
      phone: '',
      ticketCount: 1,
      isGift: false,
      recipientFirstName: '',
      recipientLastName: '',
    },
  });

  const isGift = watch('isGift');

  async function onSubmit(data: TicketFormValues) {
    try {
      setLoading(true);
      setError(null);

      // Call server-side API to create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during checkout'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CardHeader>
          <CardTitle>Purchase Tickets</CardTitle>
          <CardDescription>
            Fill out the form below to purchase your tickets for the event.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailConfirm">Confirm Email</Label>
            <Input
              id="emailConfirm"
              type="email"
              placeholder="john@example.com"
              {...register('emailConfirm')}
            />
            {errors.emailConfirm && (
              <p className="text-sm text-destructive">
                {errors.emailConfirm.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 555-5555"
              {...register('phone')}
            />
            <p className="text-sm text-muted-foreground">
              We'll only use this to contact you about your order
            </p>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticketCount">Number of Tickets</Label>
            <Input
              id="ticketCount"
              type="number"
              min={1}
              max={10}
              {...register('ticketCount', { valueAsNumber: true })}
            />
            <p className="text-sm text-muted-foreground">
              Maximum 10 tickets per order
            </p>
            {errors.ticketCount && (
              <p className="text-sm text-destructive">
                {errors.ticketCount.message}
              </p>
            )}
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox id="isGift" {...register('isGift')} />
            <div className="space-y-1 leading-none">
              <Label htmlFor="isGift">This is a gift for someone else</Label>
              <p className="text-sm text-muted-foreground">
                We'll send the tickets to the recipient's email
              </p>
            </div>
          </div>

          {isGift && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientFirstName">
                  Recipient's First Name
                </Label>
                <Input
                  id="recipientFirstName"
                  placeholder="Jane"
                  {...register('recipientFirstName')}
                />
                {errors.recipientFirstName && (
                  <p className="text-sm text-destructive">
                    {errors.recipientFirstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientLastName">Recipient's Last Name</Label>
                <Input
                  id="recipientLastName"
                  placeholder="Smith"
                  {...register('recipientLastName')}
                />
                {errors.recipientLastName && (
                  <p className="text-sm text-destructive">
                    {errors.recipientLastName.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Purchase Tickets'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Secure payment processing by{' '}
            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Stripe
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TicketsForm;
