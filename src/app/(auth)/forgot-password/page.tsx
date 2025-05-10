import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-primary">RunTV Streamer</h1>
        <p className="text-xl text-muted-foreground mt-2">Your Ultimate IPTV Experience</p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
