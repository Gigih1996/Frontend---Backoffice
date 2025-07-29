# 🏢 Employee Management System - Bootstrap Edition

## 📋 Technical Requirements

### System Requirements

- **Node.js**: Version 18.19.0 or higher
- **npm**: Version 9.0.0 or higher
- **Angular CLI**: Version 19.0.0 or higher

### Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## 🚀 Quick Start

### 1. **Clone Repository**

```bash
git clone <repository-url>
cd employee-management-bootstrap
```

### 2. **Install Dependencies**

```bash
# Install Node.js dependencies
npm install

# Install Angular CLI globally (if not already installed)
npm install -g @angular/cli@19
```

### 3. **Verify Installation**

```bash
# Check Node.js version
node --version  # Should be >= 18.19.0

# Check npm version
npm --version   # Should be >= 9.0.0

# Check Angular CLI version
ng version      # Should be >= 19.0.0
```

## 🔐 Demo Access

Use these credentials to access the application:

| Field        | Value         |
| ------------ | ------------- |
| **Username** | `admin`       |
| **Password** | `password123` |

### 🎨 **Design System**

#### **Color Palette**

- **Primary**: `#667eea` (Gradient to `#764ba2`)
- **Success**: `#28a745` (Gradient to `#20c997`)
- **Warning**: `#ffc107` (Gradient to `#ffca2c`)
- **Danger**: `#dc3545` (Gradient to `#e74c3c`)
- **Info**: `#17a2b8` (Gradient to `#20c997`)

#### **Typography**

- **Font Family**: Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Font Weights**: 300, 400, 500, 600, 700, 800
- **Responsive Scaling**: Fluid typography across devices

#### **Components**

- **Glass Cards**: backdrop-filter blur effects
- **Gradient Buttons**: Smooth hover animations
- **Smart Forms**: Real-time validation feedback
- **Animated Icons**: Bootstrap Icons with custom animations
- **Responsive Tables**: Mobile-optimized data display

#### **Animation System**

- **Entrance Animations**: fadeIn, slideInUp, slideInDown
- **Interaction Animations**: hover effects, button press
- **Page Transitions**: smooth route changes
- **Loading States**: spinners, skeleton screens
- **Micro-interactions**: button hover, form focus

### 📱 **Responsive Breakpoints**

- **Mobile**: `< 576px` (Optimized for phones)
- **Small**: `576px - 767px` (Large phones, small tablets)
- **Medium**: `768px - 991px` (Tablets)
- **Large**: `992px - 1199px` (Desktops)
- **Extra Large**: `≥ 1200px` (Large desktops)

### **Code Quality**

- **ESLint**: Modern linting with Angular-specific rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strong typing throughout
- **Unit Tests**: Jasmine & Karma setup
- **E2E Tests**: Cypress integration ready

## 📊 **Employee Data Model**

```typescript
interface Employee {
  id?: string;
  username: string; // Unique identifier
  firstName: string; // Given name
  lastName: string; // Family name
  email: string; // Contact email (validated)
  birthDate: Date; // Date of birth (age validated)
  basicSalary: number; // Monthly salary in IDR
  status: string; // Active, Inactive, Pending, Suspended
  group: string; // Department/Team
  description: string; // Additional notes (min 10 chars)
}
```

### **Available Departments**

- Engineering 🔧
- Marketing 📢
- Sales 📈
- Human Resources 👥
- Finance 💰
- Operations ⚙️
- Product Management 📦
- Customer Support 🎧
- Quality Assurance 🛡️
- Business Development 💼

### **Employee Status Options**

- **Active** ✅ - Currently employed
- **Inactive** ❌ - Not currently active
- **Pending** ⏳ - Awaiting confirmation
- **Suspended** 🚫 - Temporarily inactive
