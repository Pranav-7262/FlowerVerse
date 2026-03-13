# Admin Dashboard Component Structure

## Overview

The AdminDashboard has been refactored into multiple reusable, well-styled components for better maintainability and code organization.

## Component Breakdown

### 1. **DashboardHeader**

📁 Location: `src/components/AdminDashboard/DashboardHeader.jsx`

Displays the main dashboard header with title, icon, and description.

**Features:**

- Gradient background (dark blue to emerald)
- Icon badge
- Main title and subtitle
- Responsive design

**Props:** None

---

### 2. **StatsCard**

📁 Location: `src/components/AdminDashboard/StatsCard.jsx`

Reusable card component for displaying statistics.

**Props:**

- `icon` - Icon component from lucide-react
- `label` - Card title (e.g., "Total Users")
- `value` - Main metric number
- `description` - Subtitle text
- `color` - Color scheme (blue, purple, emerald, pink)

**Features:**

- Hover animations and shadows
- Color-coded cards
- Icon scaling on hover
- Responsive layout

---

### 3. **StatsSection**

📁 Location: `src/components/AdminDashboard/StatsSection.jsx`

Container component that displays all stats cards in a grid.

**Props:**

- `stats` - Object containing:
  - `totalUsers`
  - `adminUsers`
  - `customerUsers`
  - `totalFlowers`

**Features:**

- 4-column grid layout (responsive to 2 cols on tablet, 1 col on mobile)
- Uses StatsCard component internally
- Consistent spacing

---

### 4. **TabNavigation**

📁 Location: `src/components/AdminDashboard/TabNavigation.jsx`

Tab buttons for switching between User and Flower management sections.

**Props:**

- `activeTab` - Current active tab ('users' or 'flowers')
- `setActiveTab` - Function to update active tab
- `onAddFlower` - Callback function for add button

**Features:**

- Active tab indicator (gradient underline)
- Icons for each tab
- "Add New Flower" button
- Smooth transitions

---

### 5. **UserManagement**

📁 Location: `src/components/AdminDashboard/UserManagement.jsx`

Display and manage users with search, filtering, and role management.

**Props:**

- `users` - Array of user objects
- `loading` - Boolean for loading state
- `search` - Search term string
- `setSearch` - Function to update search
- `filter` - Current filter value ('all', 'admin', 'customer')
- `setFilter` - Function to update filter
- `setCurrentPage` - Function to reset pagination
- `changingRole` - User ID currently being updated
- `handleChangeRole` - Function to handle role changes
- `formatDate` - Function to format dates

**Features:**

- Search bar with icon
- Role filter dropdown
- Responsive table with gradient backgrounds
- Role badges with emojis
- Role change selector
- Loading and empty states
- Hover effects

---

### 6. **FlowerManagement**

📁 Location: `src/components/AdminDashboard/FlowerManagement.jsx`

Display and manage flower products with edit and delete actions.

**Props:**

- `flowers` - Array of flower objects
- `loading` - Boolean for loading state
- `formatDate` - Function to format dates
- `handleDeleteFlower` - Function to delete flowers

**Features:**

- Responsive flower table
- Category badges
- Price in rupees
- Stock status with color coding
- Edit and delete buttons with icons
- Hover animations
- Loading and empty states

---

### 7. **PaginationControls**

📁 Location: `src/components/AdminDashboard/PaginationControls.jsx`

Pagination component for user management.

**Props:**

- `currentPage` - Current page number
- `totalPages` - Total number of pages
- `onPreviousClick` - Function for previous button
- `onNextClick` - Function for next button

**Features:**

- Previous/Next buttons
- Page counter with badges
- Disabled states on boundaries
- Icons for navigation
- Responsive layout

---

## Styling Details

### Color Scheme

- **Primary Blue:** Stats card, user management accent
- **Purple:** Admin badge, secondary accent
- **Emerald:** Customers, success states
- **Pink:** Flowers, secondary accent
- **Slate:** Neutral backgrounds and borders

### Interactive Elements

- Smooth hover transitions
- Shadow depth changes
- Icon scaling (1.1x on hover)
- Gradient backgrounds on hover
- Responsive tab underlines

### Responsive Design

- Mobile: 1 column stats
- Tablet: 2 columns stats, adjusted spacing
- Desktop: 4 columns stats, full layout

---

## Usage Example

```jsx
// AdminDashboard.jsx imports all components
import DashboardHeader from "../components/AdminDashboard/DashboardHeader";
import StatsSection from "../components/AdminDashboard/StatsSection";
import TabNavigation from "../components/AdminDashboard/TabNavigation";
import UserManagement from "../components/AdminDashboard/UserManagement";
import FlowerManagement from "../components/AdminDashboard/FlowerManagement";
import PaginationControls from "../components/AdminDashboard/PaginationControls";

// Then uses them in the JSX structure for clean, modular layout
```

---

## File Structure

```
frontend/src/
├── components/
│   └── AdminDashboard/
│       ├── DashboardHeader.jsx
│       ├── StatsCard.jsx
│       ├── StatsSection.jsx
│       ├── TabNavigation.jsx
│       ├── UserManagement.jsx
│       ├── FlowerManagement.jsx
│       └── PaginationControls.jsx
└── pages/
    └── AdminDashboard.jsx (refactored main component)
```

---

## Benefits of This Structure

✅ **Modularity** - Each component has a single responsibility
✅ **Reusability** - Components can be used elsewhere if needed
✅ **Maintainability** - Easy to locate and update specific features
✅ **Testability** - Smaller components are easier to unit test
✅ **Performance** - Components can be lazy loaded if needed
✅ **Styling Consistency** - Centralized and consistent UI patterns

---

## Future Enhancements

- Add data export functionality (CSV/PDF)
- Implement bulk user actions
- Add advanced filtering options
- Create flower analytics section
- Add activity logs
- Implement audit trails
