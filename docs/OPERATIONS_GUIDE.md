# FRIENDLI TRIPZ — OPERATIONS GUIDE

## 1. Partner App Management
- **Vendor Portal** (`/vendor-portal`): QR Code voucher redemption & settlement reconciliation.
- **Hotel Portal** (`/hotel-portal`): Room allocation, guest check-in & meal preferences.
- **Driver App** (`/driver`): Route execution, duty roster & live vehicle telemetry.
- **Tour Leader App** (`/tour-leader`): Group coordination & incident logging.

---

## 2. Admin & Finance Operations
- Admin Console accessible at `/admin`.
- Single Owner governance model enforced via `is_active_admin` DB policies.
- Immutable financial ledger entries in `financial_ledger_entries` table.
