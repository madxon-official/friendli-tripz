# API Specification & Endpoint Reference — Friendli Tripz

## Public Endpoints

### 1. Health Probe
- **GET** `/api/health`
- **Query Params**: `probe=health|liveness|readiness`
- **Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": "connected",
      "cache": "operational"
    }
  }
}
```

### 2. Submit Traveller Enquiry
- **POST** `/api/enquiries`
- **Payload**:
```json
{
  "name": "Rahul Sharma",
  "phone": "+919876543210",
  "email": "rahul@example.com",
  "destination": "Kodaikanal",
  "travellerCount": 2
}
```

## Admin Gated API Routes
All admin endpoints require an active session and RBAC authorization token.
- `POST /api/admin/team/invite` — Send staff invitation
- `POST /api/admin/team/role` — Update team member role
- `POST /api/admin/enquiries/assign` — Assign enquiry to staff member
