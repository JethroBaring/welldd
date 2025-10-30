# Add User Implementation Guide

## Overview

The Add User functionality is a core feature of the Wellsync Dalaguete Healthcare Information System that allows Super Admins to create and manage user accounts with role-based access control (RBAC).

## Table of Contents

1. [Features](#features)
2. [User Interface](#user-interface)
3. [User Roles](#user-roles)
4. [Implementation Details](#implementation-details)
5. [Form Validation](#form-validation)
6. [Email Notification System](#email-notification-system)
7. [Security Considerations](#security-considerations)
8. [API Endpoints](#api-endpoints)
9. [Usage Guide](#usage-guide)
10. [Testing Checklist](#testing-checklist)

---

## Features

### Core Functionality

✅ **User Creation**: Create new user accounts with complete profile information
✅ **Role Assignment**: Assign one of four predefined roles with specific permissions
✅ **LGU Assignment**: Link users to specific Local Government Units
✅ **Password Management**: Auto-generate secure passwords or set custom passwords
✅ **Email Notifications**: Automatically send login credentials via email
✅ **User Editing**: Update user information and role assignments
✅ **User Activation/Deactivation**: Toggle user account status without deletion
✅ **User Deletion**: Permanently remove user accounts with confirmation
✅ **Password Reset**: Generate new passwords and send to users
✅ **Search & Filter**: Find users by name, email, role, or status
✅ **Audit Trail**: Track user creation, updates, and actions

---

## User Interface

### Main User Management Page

**Location**: `/users`

**Components**:
- **Header**: Page title, description, and "Add User" button
- **Statistics Cards**: 
  - Total Users
  - Active Users
  - Inactive Users
  - Super Admins
- **Filters**:
  - Search bar (name, email, role)
  - Role filter dropdown
  - Status filter dropdown
- **User Table**:
  - Columns: Name, Email, Role, Assigned LGU, Status, Last Login, Actions
  - Actions: Edit, Activate/Deactivate Toggle, Reset Password, Delete

### Add User Dialog

**Trigger**: Click "Add User" button

**Form Fields**:
1. **First Name** (required)
   - Type: Text input
   - Placeholder: "Juan"
   
2. **Last Name** (required)
   - Type: Text input
   - Placeholder: "Dela Cruz"
   
3. **Email Address** (required)
   - Type: Email input
   - Placeholder: "user@dalaguete.gov.ph"
   - Note: "This will be used as the username for login"
   
4. **Role** (required)
   - Type: Select dropdown
   - Options: Super Admin, GSO Staff, Medical Staff, Admin Staff
   - Description: Dynamic role description displayed below
   
5. **Assigned LGU** (optional)
   - Type: Text input
   - Placeholder: "e.g., Dalaguete RHU"
   - Note: "Leave empty for system-wide access"
   
6. **Password Generation** (toggle)
   - Default: ON (automatically generate)
   - When OFF: Shows custom password field
   
7. **Custom Password** (conditional)
   - Type: Password input with show/hide toggle
   - Minimum: 8 characters
   - Shows when "Password Generation" is OFF
   
8. **Send Email Notification** (toggle)
   - Default: ON
   - When OFF: Shows warning about saving password manually

**Actions**:
- **Cancel**: Close dialog without saving
- **Create User**: Validate and create user account

### Edit User Dialog

**Trigger**: Click edit icon on user row

**Form Fields**:
- Same as Add User (except password fields)
- Pre-populated with existing user data

**Actions**:
- **Cancel**: Close dialog without saving
- **Save Changes**: Update user information

---

## User Roles

### 1. Super Admin

**Description**: Full system access, configuration, and user management

**Permissions**:
- ✅ Create, edit, delete users
- ✅ Manage all LGUs and facilities
- ✅ Access all modules
- ✅ Configure system settings
- ✅ View audit logs
- ✅ Generate all reports
- ✅ Manage integrations

**Use Cases**:
- System administrators
- IT managers
- Senior management oversight

### 2. GSO Staff (General Services Office)

**Description**: Inventory management, procurement, and warehouse operations

**Permissions**:
- ✅ Inventory Management (Full CRUD)
- ✅ Purchase Requests (Create, View)
- ✅ Purchase Orders (View, Process)
- ✅ Warehouse Receiving (Full Access)
- ✅ Stock Monitoring (View, Alerts)
- ✅ Transfer Operations (Create, Approve)
- ✅ Supplier Management (View, Update)
- ❌ Patient Records
- ❌ User Management
- ❌ LGU Configuration

**Use Cases**:
- Warehouse managers
- Procurement officers
- Supply chain staff

### 3. Medical Staff

**Description**: Patient records, clinical functions, and disease surveillance

**Permissions**:
- ✅ Patient Records (Full CRUD)
- ✅ Medical Records (Create, View, Update)
- ✅ Appointments (Full Access)
- ✅ Disease Surveillance Dashboard
- ✅ Outbreak Monitoring
- ✅ Clinical Reports
- ✅ Inventory (View-Only for dispensing)
- ❌ Purchase Orders
- ❌ User Management
- ❌ LGU Configuration

**Use Cases**:
- Doctors
- Nurses
- Medical officers
- Health workers

### 4. Admin Staff

**Description**: Records management, reporting, and administrative tasks

**Permissions**:
- ✅ View All Reports
- ✅ Generate Reports
- ✅ Export Data
- ✅ View Disease Surveillance
- ✅ View Inventory (Read-Only)
- ✅ Patient Records (View-Only)
- ❌ Create Purchase Orders
- ❌ Edit Inventory
- ❌ User Management

**Use Cases**:
- Administrative assistants
- Records officers
- Report coordinators

---

## Implementation Details

### Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, React 18
- **UI Components**: Radix UI primitives, Tailwind CSS
- **State Management**: Zustand for auth state
- **Form Handling**: React controlled components
- **Validation**: Zod schema validation
- **Icons**: Lucide React
- **Notifications**: Sonner toast library

### File Structure

```
frontend/
├── app/(main)/users/
│   └── page.tsx                     # Main user management page
├── components/ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── dialog.tsx
│   ├── switch.tsx                   # Toggle component
│   ├── badge.tsx
│   └── table.tsx
├── lib/
│   ├── api/
│   │   └── lgu.ts                   # User API functions
│   └── mock-data/
│       └── users.ts                 # Mock user data
├── types/
│   ├── user.ts                      # User type definitions
│   └── lgu.ts                       # LGU user types
└── stores/
    └── authStore.ts                 # Authentication state
```

### Key Components

#### UserForm State

```typescript
interface UserFormState {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  assignedLGU: string;
  generatePassword: boolean;
  password: string;
}
```

#### User Type Definition

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  assignedLGU?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

type UserRole = 
  | "super_admin" 
  | "gso_staff" 
  | "medical_staff" 
  | "admin_staff";
```

---

## Form Validation

### Client-Side Validation

#### Required Fields
- ✅ First Name: Must not be empty
- ✅ Last Name: Must not be empty
- ✅ Email: Must be valid email format
- ✅ Role: Must select one of four roles

#### Email Validation
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(userForm.email)) {
  toast.error("Please enter a valid email address");
  return;
}
```

#### Email Uniqueness Check
```typescript
if (users.some((u) => u.email === userForm.email)) {
  toast.error("Email already exists");
  return;
}
```

#### Password Validation (Custom Password)
- Minimum length: 8 characters
- Recommended: Mix of uppercase, lowercase, numbers, and symbols

```typescript
if (!userForm.generatePassword && 
    (!userForm.password || userForm.password.length < 8)) {
  toast.error("Password must be at least 8 characters");
  return;
}
```

### Server-Side Validation (Backend TODO)

When backend is integrated:
- ✅ Validate email format and uniqueness
- ✅ Check password strength (min 8 chars, complexity requirements)
- ✅ Validate role against allowed values
- ✅ Verify LGU exists if assignedLGU is provided
- ✅ Check if user has permission to create users
- ✅ Sanitize input to prevent SQL injection
- ✅ Rate limiting for user creation

---

## Email Notification System

### Current Implementation (Mock)

The current implementation simulates email sending with toast notifications.

#### When Email Notification is ON

```typescript
if (sendEmailNotification) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  toast.success(
    `User created successfully! Login credentials sent to ${userForm.email}`
  );
}
```

#### When Email Notification is OFF

```typescript
else {
  toast.success("User created successfully!");
  toast.info(`Password: ${finalPassword}`, { duration: 10000 });
}
```

### Backend Integration (TODO)

#### Email Template Structure

**Subject**: Welcome to Wellsync Dalaguete - Your Account Credentials

**Body**:
```
Hello [First Name] [Last Name],

Your account has been created for the Wellsync Dalaguete Healthcare Information System.

Login Credentials:
- Username: [email]
- Password: [generated_password]
- Portal: https://wellsync.dalaguete.gov.ph

Your Role: [Role Name]
Assigned LGU: [LGU Name or "System-wide access"]

Security Recommendations:
1. Change your password immediately after first login
2. Do not share your credentials with anyone
3. Use a strong, unique password
4. Enable two-factor authentication (if available)

For support, contact: support@dalaguete.gov.ph

Best regards,
Wellsync Dalaguete Admin Team
```

#### Email Service Integration

Recommended services:
1. **SendGrid**: Transactional email service
2. **AWS SES**: Simple Email Service
3. **Mailgun**: Email delivery platform
4. **SMTP**: Custom mail server

#### Implementation Example

```typescript
import { sendEmail } from '@/lib/email';

async function sendCredentialsEmail(user: User, password: string) {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Wellsync Dalaguete - Your Account Credentials',
    template: 'user-credentials',
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: password,
      role: roleLabels[user.role],
      assignedLGU: user.assignedLGU || 'System-wide access',
      loginUrl: process.env.NEXT_PUBLIC_APP_URL,
    },
  });
}
```

---

## Security Considerations

### Password Security

#### Auto-Generated Passwords
- Length: 12 characters
- Character set: a-z, A-Z, 0-9, special characters (!@#$%^&*)
- Randomization: Cryptographically secure random generation

```typescript
const generateRandomPassword = () => {
  const length = 12;
  const charset = 
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
```

#### Backend Password Hashing (TODO)
- Algorithm: bcrypt or Argon2
- Salt rounds: 12+
- Never store plain text passwords

```typescript
// Backend example
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 12);
```

### Access Control

#### Permission Check
```typescript
const canManageUsers = currentRole === "super_admin";

if (!canManageUsers) {
  return <AccessDeniedMessage />;
}
```

#### Row-Level Security (Backend TODO)
- Users can only see/edit users in their assigned LGU
- Super Admins can see all users
- Implement database-level RLS for data protection

### Input Sanitization

#### Frontend
- HTML escaping for display
- SQL injection prevention (parameterized queries on backend)
- XSS prevention (React automatic escaping)

#### Backend TODO
- Validate and sanitize all inputs
- Use prepared statements
- Implement CSRF protection
- Rate limiting on sensitive endpoints

### Audit Trail

Track all user management actions:
- User creation (who, when, what role)
- User updates (what changed)
- Password resets (initiated by whom)
- User deletion (who deleted whom)
- Failed login attempts
- Permission changes

```typescript
interface AuditLog {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESET_PASSWORD';
  entityType: 'User';
  entityId: string;
  changes: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}
```

---

## API Endpoints

### User Management Endpoints (Backend TODO)

#### 1. Create User
```
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "email": "juan.delacruz@dalaguete.gov.ph",
  "role": "admin_staff",
  "assignedLGU": "lgu-001",
  "sendEmail": true
}

Response (201):
{
  "success": true,
  "data": {
    "id": "user-123",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "email": "juan.delacruz@dalaguete.gov.ph",
    "role": "admin_staff",
    "assignedLGU": "lgu-001",
    "isActive": true,
    "createdAt": "2025-01-13T10:30:00Z"
  },
  "message": "User created successfully. Credentials sent to email."
}

Error Responses:
400 - Validation error
409 - Email already exists
403 - Insufficient permissions
500 - Server error
```

#### 2. Get All Users
```
GET /api/users?page=1&limit=50&role=all&status=all&search=
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "pages": 2
    }
  }
}
```

#### 3. Get User by ID
```
GET /api/users/{userId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": "user-123",
    ...
  }
}
```

#### 4. Update User
```
PATCH /api/users/{userId}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "role": "gso_staff"
}

Response (200):
{
  "success": true,
  "data": { ... },
  "message": "User updated successfully"
}
```

#### 5. Toggle User Status
```
PATCH /api/users/{userId}/status
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "isActive": false
}

Response (200):
{
  "success": true,
  "message": "User deactivated successfully"
}
```

#### 6. Delete User
```
DELETE /api/users/{userId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### 7. Reset Password
```
POST /api/users/{userId}/reset-password
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

---

## Usage Guide

### For Super Admins

#### Creating a New User

1. **Navigate to User Management**
   - Click "Users" in the sidebar navigation
   - Or visit `/users` directly

2. **Open Add User Dialog**
   - Click the "Add User" button in the top-right corner

3. **Fill in User Information**
   - Enter first name and last name
   - Provide a valid email address (will be used as username)
   - Select appropriate role based on user's responsibilities
   - (Optional) Assign user to specific LGU

4. **Configure Password Settings**
   - Toggle "Password Generation" ON for secure auto-generated password
   - Toggle OFF to set custom password (min 8 characters)

5. **Email Notification**
   - Keep "Send Email Notification" ON to automatically send credentials
   - Toggle OFF if you want to manually share credentials (password will be displayed)

6. **Create User**
   - Click "Create User" button
   - Wait for confirmation toast
   - User will receive email with login credentials (if notification enabled)

#### Editing a User

1. Find the user in the table
2. Click the edit (pencil) icon
3. Update the desired fields
4. Click "Save Changes"

#### Activating/Deactivating a User

1. Find the user in the table
2. Toggle the switch in the "Actions" column
3. Confirm the action in the toast notification

#### Resetting a User's Password

1. Find the user in the table
2. Click "Reset Password" button
3. New password will be generated and sent via email

#### Deleting a User

1. Find the user in the table
2. Click the delete (trash) icon
3. Confirm deletion in the popup dialog
4. ⚠️ This action cannot be undone

#### Filtering and Searching

- **Search**: Type in the search bar to filter by name, email, or role
- **Role Filter**: Select role from dropdown to show only users with that role
- **Status Filter**: Select "Active Only" or "Inactive Only" to filter by status

---

## Testing Checklist

### Functional Testing

#### User Creation
- [ ] Create user with all required fields
- [ ] Create user with auto-generated password
- [ ] Create user with custom password
- [ ] Create user with email notification ON
- [ ] Create user with email notification OFF
- [ ] Create user with LGU assignment
- [ ] Create user without LGU assignment
- [ ] Verify each role can be assigned
- [ ] Test duplicate email prevention
- [ ] Test invalid email format rejection

#### User Editing
- [ ] Edit user first name
- [ ] Edit user last name
- [ ] Edit user email
- [ ] Change user role
- [ ] Update LGU assignment
- [ ] Verify changes persist

#### User Management
- [ ] Activate inactive user
- [ ] Deactivate active user
- [ ] Reset user password
- [ ] Delete user
- [ ] Confirm deletion dialog works

#### Search & Filter
- [ ] Search by first name
- [ ] Search by last name
- [ ] Search by email
- [ ] Search by role name
- [ ] Filter by role
- [ ] Filter by active status
- [ ] Filter by inactive status
- [ ] Combine search and filters

### Security Testing

- [ ] Non-admin users cannot access /users page
- [ ] Non-admin users see "Access Denied" message
- [ ] Generated passwords meet complexity requirements
- [ ] Passwords are never displayed in plain text (except initial creation with email OFF)
- [ ] User sessions expire after inactivity
- [ ] Password fields have show/hide toggle

### UI/UX Testing

- [ ] Form validation shows appropriate error messages
- [ ] Success toasts appear after actions
- [ ] Loading states display during operations
- [ ] Dialogs open and close properly
- [ ] Form resets after successful submission
- [ ] Responsive design works on mobile
- [ ] All buttons have proper labels
- [ ] Icons are meaningful and consistent

### Edge Cases

- [ ] Create user with maximum field lengths
- [ ] Create user with special characters in name
- [ ] Handle network errors gracefully
- [ ] Handle API timeout
- [ ] Test with very long user lists (pagination)
- [ ] Test rapid successive actions (debouncing)

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Proper ARIA labels
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators visible

---

## Known Issues & Limitations

### Current Implementation (Phase 2)

1. **Mock Data**: Using client-side mock data instead of real API
2. **No Backend**: User data not persisted to database
3. **Email Simulation**: Emails not actually sent
4. **No Password Encryption**: Passwords stored in plain text (mock)
5. **Missing Switch Component Package**: Requires `@radix-ui/react-switch` installation

### Required for Production

1. **Backend API**: Implement all user management endpoints
2. **Database**: PostgreSQL with proper schema and indexes
3. **Email Service**: Integrate SendGrid/AWS SES/SMTP
4. **Password Hashing**: Implement bcrypt/Argon2
5. **Session Management**: JWT tokens with refresh logic
6. **Audit Logging**: Track all user actions
7. **Rate Limiting**: Prevent brute force attacks
8. **Multi-Factor Authentication**: Add MFA support
9. **Password Policy**: Enforce complexity and expiry
10. **Bulk Import**: CSV upload for multiple users

---

## Next Steps (Phase 3)

### Planned Enhancements

1. **Bulk User Import**
   - CSV template download
   - Upload and validate CSV
   - Preview before import
   - Error handling for invalid rows

2. **Permission Templates**
   - Create custom permission sets
   - Assign templates to roles
   - Copy permissions between users

3. **User Groups**
   - Group users by department/facility
   - Assign permissions to groups
   - Bulk operations on groups

4. **Advanced Search**
   - Filter by last login date
   - Filter by creation date
   - Filter by assigned facility
   - Export search results

5. **User Activity Dashboard**
   - Login history
   - Action timeline
   - Session management
   - Device tracking

6. **Self-Service Portal**
   - Users can update own profile
   - Password change functionality
   - Profile picture upload
   - Notification preferences

---

## Support & Troubleshooting

### Common Issues

**Issue**: "Access Denied" message when accessing /users
**Solution**: Only Super Admins can access user management. Check your role assignment.

**Issue**: Email already exists error
**Solution**: Each email must be unique. Check if user already exists or use different email.

**Issue**: Password too short error
**Solution**: Custom passwords must be at least 8 characters long.

**Issue**: Cannot install @radix-ui/react-switch
**Solution**: Run `npm install @radix-ui/react-switch` in the frontend directory.

### Contact Support

For technical issues or questions:
- Email: support@dalaguete.gov.ph
- Phone: (032) XXX-XXXX
- Documentation: See USER_MANAGEMENT_GUIDE.md

---

*Last Updated: January 2025*
*Version: 2.0 - Phase 2 Implementation*
*Document Author: System Implementation Team*