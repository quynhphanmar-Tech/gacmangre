import { FulfillmentStatus } from '@/types';

/**
 * Valid state transitions for the Gạc Măng Rê Fulfillment State Machine.
 * PENDING
 *    ↓
 * PRODUCER_CONFIRMED
 *    ↓
 * PREPARING
 *    ↓
 * READY_TO_RECEIVE
 *    ↓
 * RECEIVED
 *    ↓
 * PACKED
 *    ↓
 * READY_TO_SHIP
 *    ↓
 * SHIPPED
 *    ↓
 * DELIVERED
 */
export const ALLOWED_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  PENDING: ['PRODUCER_CONFIRMED', 'CANCELLED'],
  PRODUCER_CONFIRMED: ['PREPARING', 'PACKED', 'CANCELLED'],
  PREPARING: ['READY_TO_RECEIVE', 'PACKED', 'CANCELLED'],
  READY_TO_RECEIVE: ['RECEIVED', 'CANCELLED', 'FAILED'],
  RECEIVED: ['PACKED', 'CANCELLED'],
  PACKED: ['READY_TO_SHIP', 'SHIPPED', 'CANCELLED'],
  READY_TO_SHIP: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'RETURNED', 'FAILED'],
  DELIVERED: ['RETURNED'], // Can return after delivery
  CANCELLED: [],
  FAILED: ['READY_TO_RECEIVE', 'READY_TO_SHIP'], // Retry after resolution
  RETURNED: [],
};

/**
 * Checks if a transition from current status to next status is valid.
 */
export function isValidTransition(current: FulfillmentStatus, next: FulfillmentStatus): boolean {
  if (current === next) return true; // Idempotent same-state check
  const allowed = ALLOWED_TRANSITIONS[current];
  return Boolean(allowed && allowed.includes(next));
}
