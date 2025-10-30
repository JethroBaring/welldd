# Quick Reference Guide - Phase 2 Deliverables

**Last Updated**: January 2025  
**Phase**: 2 - Enhanced Modules & System Architecture

---

## 📑 Quick Links

| Document | Purpose | Link |
|----------|---------|------|
| **System ERD** | Complete database architecture | `SYSTEM_ERD.md` |
| **Add User Guide** | User management implementation | `ADD_USER_IMPLEMENTATION.md` |
| **Phase 2 README** | Complete deliverables overview | `PHASE2_DELIVERABLES_README.md` |
| **User Guide** | End-user documentation | `USER_MANAGEMENT_GUIDE.md` |

---

## 🗂️ System ERD - At a Glance

### Total Entities: 33 | Total Relationships: 58

```
┌─────────────────────────────────────────────────┐
│              WELLSYNC DALAGUETE                 │
│           System Architecture (ERD)             │
├─────────────────────────────────────────────────┤
│                                                 │
│  🔐 USER MANAGEMENT (4 entities)                │
│      User, Role, UserSession, AuditLog         │
│                                                 │
│  🏛️ LGU MANAGEMENT (3 entities)                 │
│      LGU, Barangay, Facility                   │
│                                                 │
│  👤 PATIENT MANAGEMENT (3 entities)             │
│      Patient, MedicalRecord, Appointment       │
│                                                 │
│  🦠 DISEASE SURVEILLANCE (3 entities)           │
│      DiseaseCase, OutbreakAlert, Forecast      │
│                                                 │
│  📦 INVENTORY MANAGEMENT (7 entities)           │
│      InventoryItem, Batch, Transaction,        │
│      StockAdjustment, TransferOut, Alert       │
│                                                 │
│  🛒 PROCUREMENT (7 entities)                    │
│      Supplier, PurchaseRequest, PurchaseOrder  │
│      WarehouseReceiving, Items (3 tables)      │
│                                                 │
│  📊 REPORTING (2 entities)                      │
│      Report, Dashboard                         │
│                                                 │
│  🔗 INTEGRATION (2 entities)                    │
│      ExternalIntegration, SyncLog              │
│                                                 │
│  🔔 NOTIFICATIONS (2 entities)                  │
│      Notification, EmailQueue                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Key Relationships

```
User ──┬──> LGU ──┬──> Barangay
       │          └──> Facility
       │
       └──> MedicalRecord ──> Patient ──> DiseaseCase
                                              │
                                              └──> OutbreakAlert

PurchaseRequest ──> PurchaseOrder ──> WarehouseReceiving ──> Batch ──> InventoryItem
                                                                            │
                                                                            └──> Transaction
```

---

## 👥 Add User - Quick Start

### Access
- **URL**: `/users`
- **Permission**: Super Admin only
- **Method**: Click "Add User" button

### Quick Create User

```
1. Fill Required Fields:
   ✓ First Name
   ✓ Last Name  
   ✓ Email (will be username)
   ✓ Role

2. Select Role:
   • Super Admin - Full access
   • GSO Staff - Inventory/Procurement
   • Medical Staff - Patients/Clinical
   • Admin Staff - Reports/Records

3. Optional Settings:
   • Assign to LGU
   • Custom password (or auto-generate)
   • Email notification (ON/OFF)

4. Click "Create User"
```

### User Roles Comparison

| Feature | Super Admin | GSO Staff | Medical Staff | Admin Staff |
|---------|-------------|-----------|---------------|-------------|
| User Management | ✅ | ❌ | ❌ | ❌ |
| Inventory | ✅ | ✅ | View | View |
| Procurement | ✅ | ✅ | ❌ | View |
| Patients | ✅ | ❌ | ✅ | View |
| Surveillance | ✅ | View | ✅ | View |
| Reports | ✅ | ✅ | ✅ | ✅ |
| LGU Config | ✅ | ❌ | ❌ | ❌ |

---

## 🔧 Common Tasks

### Create a User
```
Navigate to: /users
Click: "Add User"
Fill: Name, Email, Role
Select: Auto-generate password (recommended)
Enable: Send Email Notification
Click: "Create User"
```

### Edit a User
```
Navigate to: /users
Find: User in table
Click: Edit icon (pencil)
Modify: Fields as needed
Click: "Save Changes"
```

### Reset User Password
```
Navigate to: /users
Find: User in table
Click: "Reset Password"
Confirm: Action
Result: New password sent to email
```

### Deactivate a User
```
Navigate to: /users
Find: User in table
Toggle: Status switch to OFF
Confirm: User deactivated
```

### Search Users
```
Use search bar: Type name, email, or role
Filter by role: Select from dropdown
Filter by status: Active/Inactive/All
```

---

## 🎯 Password Guidelines

### Auto-Generated Password (Recommended)
- **Length**: 12 characters
- **Complexity**: Mixed case + numbers + symbols
- **Example**: `aB3$xR9@mK2p`

### Custom Password Requirements
- **Minimum**: 8 characters
- **Recommended**: 12+ characters
- **Include**: Uppercase, lowercase, numbers, symbols
- **Avoid**: Common words, sequential numbers, birthdays

---

## 📊 ERD Quick Facts

### By Module

| Module | Entities | Primary Use |
|--------|----------|-------------|
| User Management | 4 | Authentication & access control |
| LGU Management | 3 | Geographic organization |
| Patient Management | 3 | Clinical records |
| Disease Surveillance | 3 | Outbreak detection |
| Inventory | 7 | Supply chain tracking |
| Procurement | 7 | Purchase workflow |
| Reporting | 2 | Analytics & BI |
| Integration | 2 | External systems |
| Notifications | 2 | Messaging |

### Critical Relationships

1. **User → LGU**: User assignment and data access
2. **Patient → Barangay**: Geographic tracking
3. **DiseaseCase → OutbreakAlert**: Threshold-based alerts
4. **PR → PO → WRR**: Procurement workflow
5. **Batch → Transaction**: Inventory audit trail

---

## 💻 Installation Commands

### Install Dependencies
```bash
cd frontend
npm install
```

### Install Missing Component
```bash
npm install @radix-ui/react-switch
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

---

## 🔍 Troubleshooting

### Issue: "Access Denied" on /users
**Cause**: User is not Super Admin  
**Solution**: Log in with Super Admin account

### Issue: "Email already exists"
**Cause**: Email is already registered  
**Solution**: Use different email or edit existing user

### Issue: Switch component error
**Cause**: Missing Radix UI package  
**Solution**: Run `npm install @radix-ui/react-switch`

### Issue: Password too short
**Cause**: Custom password < 8 characters  
**Solution**: Use longer password or enable auto-generate

### Issue: Cannot see mock data
**Cause**: Page not loaded or error  
**Solution**: Check browser console, refresh page

---

## 🌐 URLs

### Main Routes
- `/users` - User management (Super Admin)
- `/lgu` - LGU management
- `/lgu/new` - Create new LGU
- `/lgu/[id]` - LGU details
- `/patients` - Patient management
- `/inventory` - Inventory overview
- `/surveillance` - Disease surveillance

### API Endpoints (Future)
- `POST /api/users` - Create user
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/reset-password` - Reset password

---

## 📋 Testing Checklist

### User Management Tests
- [ ] Create user with auto-generated password
- [ ] Create user with custom password
- [ ] Edit user information
- [ ] Change user role
- [ ] Activate/deactivate user
- [ ] Delete user
- [ ] Search users
- [ ] Filter by role
- [ ] Filter by status
- [ ] Reset password

### ERD Validation
- [ ] All entities documented
- [ ] All relationships mapped
- [ ] Primary keys defined
- [ ] Foreign keys defined
- [ ] Data types specified
- [ ] Constraints documented

---

## 🎨 UI Components Used

| Component | Package | Usage |
|-----------|---------|-------|
| Button | @/components/ui/button | Actions |
| Input | @/components/ui/input | Text fields |
| Select | @/components/ui/select | Dropdowns |
| Dialog | @/components/ui/dialog | Modals |
| Switch | @/components/ui/switch | Toggles |
| Badge | @/components/ui/badge | Status labels |
| Table | @/components/ui/table | Data display |
| Card | @/components/ui/card | Containers |
| Label | @/components/ui/label | Form labels |
| Skeleton | @/components/ui/skeleton | Loading states |

---

## 📞 Support Contacts

**Technical Support**  
Email: support@dalaguete.gov.ph  
Phone: (032) XXX-XXXX

**IT Department**  
For system access and permissions

**Training Coordinator**  
For user training and onboarding

---

## 🎓 Training Resources

### Documentation
- System ERD: `SYSTEM_ERD.md`
- Implementation Guide: `ADD_USER_IMPLEMENTATION.md`
- User Guide: `USER_MANAGEMENT_GUIDE.md`

### Online Resources
- Mermaid Diagrams: https://mermaid.js.org/
- Next.js Docs: https://nextjs.org/docs
- Radix UI: https://www.radix-ui.com/

---

## 🔐 Security Reminders

### For Administrators
- ✅ Only create users with legitimate need
- ✅ Assign minimum required role
- ✅ Review user list regularly
- ✅ Deactivate users who leave
- ✅ Use strong passwords
- ✅ Keep audit logs

### For All Users
- ✅ Change default password immediately
- ✅ Do not share credentials
- ✅ Log out when finished
- ✅ Report suspicious activity
- ✅ Use strong, unique passwords

---

## 📈 Next Steps

### Phase 2 Complete ✅
- [x] System ERD created
- [x] User management implemented
- [x] Documentation completed

### Phase 3 Upcoming 🔲
- [ ] Backend API development
- [ ] Database implementation
- [ ] Email service integration
- [ ] Authentication system
- [ ] Audit logging
- [ ] Production deployment

---

## 🔗 Related Documentation

```
Root Directory Files:
├── SYSTEM_ERD.md                    ← Complete ERD
├── ADD_USER_IMPLEMENTATION.md       ← Technical guide
├── PHASE2_DELIVERABLES_README.md    ← Full overview
├── USER_MANAGEMENT_GUIDE.md         ← End-user guide
├── PHASE2_IMPLEMENTATION_SUMMARY.md ← Technical summary
└── QUICK_REFERENCE.md               ← This file
```

---

## 💡 Pro Tips

1. **Use auto-generated passwords** - More secure than custom ones
2. **Enable email notifications** - Users receive credentials automatically
3. **Assign specific LGUs** - Limits data access appropriately
4. **Review inactive users** - Deactivate instead of delete for audit trail
5. **Use search filters** - Find users quickly in large lists
6. **Check ERD before coding** - Understand data relationships first
7. **Test with mock data** - Verify functionality before backend integration
8. **Document custom changes** - Keep ERD and docs updated

---

**Need more details?**  
Refer to the comprehensive documentation files listed above.

**Ready to start?**  
Navigate to `/users` and click "Add User"!

---

*Version: 2.0 | Phase: 2 Complete | Status: ✅ Ready*