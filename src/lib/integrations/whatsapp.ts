export async function sendWhatsAppMessage(recipientPhone: string, templateName: string, params: Record<string, string>) {
  return {
    success: true,
    messageId: `wmid.${Math.random().toString(36).substring(2, 12)}`,
    status: 'sent',
  };
}
