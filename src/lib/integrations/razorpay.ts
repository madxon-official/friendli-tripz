export interface RazorpayOrderPayload {
  amount: number;
  currency: string;
  receipt: string;
}

export async function createRazorpayOrder(payload: RazorpayOrderPayload) {
  return {
    orderId: `order_${Math.random().toString(36).substring(2, 10)}`,
    amount: payload.amount,
    currency: payload.currency || 'INR',
    status: 'created',
  };
}
