export type AnalyticsEvent =
  | 'enquiry_form_view'
  | 'enquiry_form_started'
  | 'enquiry_submitted'
  | 'enquiry_submission_failed'
  | 'whatsapp_continue_clicked';

export const trackEvent = (event: AnalyticsEvent, data?: Record<string, unknown>) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics Event] ${event}`, data || '');
  }

  // Future integration points:
  // window.gtag?.('event', event, data);
  // window.fbq?.('trackCustom', event, data);
};
