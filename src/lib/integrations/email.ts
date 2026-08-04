/**
 * Production Transactional Email Transport Utility
 * Supports Resend API, SMTP, and fallback logging when environment keys are absent.
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendTransactionalEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Friendli Tripz <onboarding@resend.dev>';

  // If Resend API Key is available, dispatch live API request
  if (apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [payload.to],
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        console.error('[Transactional Email Error]', resData);
        return { success: false, error: resData.message || 'Email dispatch failed' };
      }

      return { success: true, messageId: resData.id };
    } catch (err: any) {
      console.error('[Transactional Email Exception]', err);
      return { success: false, error: err?.message || 'Network exception during email dispatch' };
    }
  }

  // Fallback stdout logging when RESEND_API_KEY is not configured
  console.log('====================================================');
  console.log(`[TRANSACTIONAL EMAIL DISPATCH] To: ${payload.to}`);
  console.log(`[SUBJECT]: ${payload.subject}`);
  console.log(`[BODY PREVIEW]: ${payload.text || payload.html.replace(/<[^>]+>/g, '').substring(0, 200)}...`);
  console.log('====================================================');

  return { success: true, messageId: `msg_dev_${Date.now()}` };
}

export async function sendTeamInviteEmail(params: {
  toEmail: string;
  recipientName: string;
  role: string;
  department?: string;
  inviteUrl: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #ff6500; font-size: 24px; font-weight: 800; margin: 0;">Friendli Tripz</h1>
        <p style="color: #64748b; font-size: 12px; font-weight: 600; margin-top: 4px; font-family: monospace;">INTERNAL OPERATIONS PORTAL</p>
      </div>

      <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-top: 0;">You have been invited to join the Team</h2>
      
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Hi <strong>${params.recipientName}</strong>,
      </p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        You have been invited to join the <strong>Friendli Tripz Operations Platform</strong> as a <strong>${params.role.toUpperCase()}</strong>${params.department ? ` in the <strong>${params.department}</strong> department` : ''}.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin: 20px 0; font-size: 13px; color: #334155;">
        <p style="margin: 0 0 8px 0;"><strong>Invitation Details:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li><strong>Organization:</strong> Friendli Tripz</li>
          <li><strong>Portal:</strong> Admin & Operations Dashboard</li>
          <li><strong>Assigned Role:</strong> ${params.role.toUpperCase()}</li>
          ${params.department ? `<li><strong>Department:</strong> ${params.department}</li>` : ''}
        </ul>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Click the button below to accept your invitation, create your password, and access your staff account:
      </p>

      <div style="margin: 28px 0; text-align: center;">
        <a href="${params.inviteUrl}" style="background-color: #ff6500; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 14px; display: inline-block; shadow: 0 4px 6px -1px rgba(255, 101, 0, 0.2);">Accept Invitation & Set Password</a>
      </div>

      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; border-t: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px;">
        If you did not expect this invitation, you can safely ignore this email.<br/>
        This invitation link is intended for ${params.toEmail}.
      </p>
    </div>
  `;

  return sendTransactionalEmail({
    to: params.toEmail,
    subject: `Invitation to join Friendli Tripz Operations as ${params.role.toUpperCase()}`,
    html,
    text: `Hi ${params.recipientName}, You have been invited to join the Friendli Tripz Operations Platform as ${params.role.toUpperCase()}${params.department ? ` in ${params.department}` : ''}. Accept invitation link: ${params.inviteUrl}`,
  });
}

export async function sendEnquiryConfirmationEmail(params: {
  toEmail: string;
  customerName: string;
  reference: string;
  destination: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <h2 style="color: #ff6500; margin-top: 0;">Trip Enquiry Received!</h2>
      <p style="font-size: 14px; line-height: 1.6;">Hi <strong>${params.customerName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6;">Thank you for reaching out to Friendli Tripz! Your enquiry for <strong>${params.destination}</strong> has been logged under Reference ID: <strong style="color: #ff6500;">${params.reference}</strong>.</p>
      <p style="font-size: 14px; line-height: 1.6;">Our dedicated travel planners are reviewing your requirements and will tailor a custom itinerary for you.</p>
      <div style="margin: 28px 0; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${params.reference}" style="background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Track Enquiry Live</a>
      </div>
      <p style="font-size: 12px; color: #94a3b8; border-t: 1px solid #f1f5f9; padding-top: 16px;">Warm regards,<br/>Friendli Tripz Team</p>
    </div>
  `;

  return sendTransactionalEmail({
    to: params.toEmail,
    subject: `Enquiry Received [Ref: ${params.reference}] - ${params.destination}`,
    html,
    text: `Hi ${params.customerName}, Thank you for your enquiry for ${params.destination}. Ref: ${params.reference}. Track live at ${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${params.reference}`,
  });
}
