<?php

namespace App\Mail;

use App\Models\RegistrationRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegistrationApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $activationUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(public RegistrationRequest $registrationRequest)
    {
        $this->activationUrl = route('activation.show', ['token' => $registrationRequest->activation_token]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "تم اعتماد طلب تسجيل مؤسسة ({$this->registrationRequest->organization_name}) - منصة عقل",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.registration_approved',
            with: [
                'registrationRequest' => $this->registrationRequest,
                'activationUrl' => $this->activationUrl,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
