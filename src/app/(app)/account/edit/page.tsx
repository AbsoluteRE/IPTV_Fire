'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mail, Lock, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const emailSchema = z.object({
  currentEmail: z.string().email().default("currentuser@example.com"), // Prefill for demo
  newEmail: z.string().email({ message: 'Invalid new email address' }),
  otpEmail: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required'}), // Simplified for demo
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }),
  confirmNewPassword: z.string().min(6),
  otpPassword: z.string().length(6, { message: 'OTP must be 6 digits' }),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function EditAccountPage() {
  const { toast } = useToast();
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showPasswordOtp, setShowPasswordOtp] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { currentEmail: 'currentuser@example.com', newEmail: '', otpEmail: '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '', otpPassword: ''},
  });

  const handleSendOtp = async (type: 'email' | 'password') => {
    if (type === 'email' && !emailForm.getValues('newEmail')) {
        emailForm.setError('newEmail', { type: 'manual', message: 'New email is required to send OTP.'});
        return;
    }
    // Mock OTP sending
    toast({ title: `OTP Sent`, description: `An OTP has been sent for ${type} change.` });
    if (type === 'email') setShowEmailOtp(true);
    if (type === 'password') setShowPasswordOtp(true);
  };

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsEmailLoading(true);
    console.log('Change email data:', data);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: 'Email Updated Successfully', description: `Your email has been changed to ${data.newEmail}.` });
    setIsEmailLoading(false);
    setShowEmailOtp(false);
    emailForm.reset({currentEmail: data.newEmail, newEmail: '', otpEmail: ''});
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsPasswordLoading(true);
    console.log('Change password data:', data);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: 'Password Updated Successfully' });
    setIsPasswordLoading(false);
    setShowPasswordOtp(false);
    passwordForm.reset();
  };

  return (
    <div className="container mx-auto py-8 px-2 md:px-4 max-w-2xl">
      <Link href="/account" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Account
      </Link>
      <Card className="shadow-xl">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-3xl md:text-4xl font-bold">Edit Account Details</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Update your email or password. OTP verification required for critical changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-10">
          {/* Change Email Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><Mail className="mr-3 h-6 w-6 text-primary" /> Change Email</h2>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="currentEmail">Current Email</Label>
                <Input id="currentEmail" type="email" {...emailForm.register('currentEmail')} readOnly className="bg-muted/50 cursor-not-allowed" />
              </div>
              <div>
                <Label htmlFor="newEmail">New Email</Label>
                <Input id="newEmail" type="email" placeholder="new.email@example.com" {...emailForm.register('newEmail')} />
                {emailForm.formState.errors.newEmail && <p className="text-sm text-destructive">{emailForm.formState.errors.newEmail.message}</p>}
              </div>
              
              {showEmailOtp && (
                <div>
                  <Label htmlFor="otpEmail">Email OTP</Label>
                  <Input id="otpEmail" placeholder="Enter 6-digit OTP" {...emailForm.register('otpEmail')} />
                  {emailForm.formState.errors.otpEmail && <p className="text-sm text-destructive">{emailForm.formState.errors.otpEmail.message}</p>}
                </div>
              )}

              <CardFooter className="p-0 pt-2">
                {!showEmailOtp ? (
                  <Button type="button" variant="outline" onClick={() => handleSendOtp('email')}>Send OTP</Button>
                ) : (
                  <Button type="submit" disabled={isEmailLoading}>
                    {isEmailLoading ? 'Updating Email...' : 'Update Email'}
                  </Button>
                )}
              </CardFooter>
            </form>
          </section>

          <Separator />

          {/* Change Password Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><Lock className="mr-3 h-6 w-6 text-primary" /> Change Password</h2>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" {...passwordForm.register('currentPassword')} />
                 {passwordForm.formState.errors.currentPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>}
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" {...passwordForm.register('newPassword')} />
                {passwordForm.formState.errors.newPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input id="confirmNewPassword" type="password" placeholder="Confirm new password" {...passwordForm.register('confirmNewPassword')} />
                {passwordForm.formState.errors.confirmNewPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmNewPassword.message}</p>}
              </div>

              {showPasswordOtp && (
                 <div>
                  <Label htmlFor="otpPassword">Password Change OTP</Label>
                  <Input id="otpPassword" placeholder="Enter 6-digit OTP" {...passwordForm.register('otpPassword')} />
                  {passwordForm.formState.errors.otpPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.otpPassword.message}</p>}
                </div>
              )}

              <CardFooter className="p-0 pt-2">
                {!showPasswordOtp ? (
                  <Button type="button" variant="outline" onClick={() => handleSendOtp('password')}>Send OTP</Button>
                ) : (
                  <Button type="submit" disabled={isPasswordLoading}>
                    {isPasswordLoading ? 'Updating Password...' : 'Update Password'}
                  </Button>
                )}
              </CardFooter>
            </form>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
