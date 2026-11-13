# CraveBite - Food Delivery React App 🍔🍕🍜

A modern, responsive Food Delivery single-page application built with **React**, **Vite**, and **Tailwind CSS**.

## ✨ Features

- **Food Item Catalog / List Page**:
  - Filter by category (Burgers, Pizzas, Asian, Mexican, Healthy Bowls, Desserts, Drinks).
  - Dietary toggles: Filter by **All**, **Pure Veg** (green indicator), or **Non-Veg** (red indicator).
  - Live search bar by dish name, description, category, or restaurant.
  - Sorting by **Most Popular**, **Highest Rated**, **Price (Low to High)**, **Price (High to Low)**, and **Fastest Delivery**.
- **Interactive Food Item Cards**:
  - Unsplash photography with hover zoom effects.
  - Badges for preparation time, calorie counts, star ratings, and dietary tags.
  - Quick-add button that converts into an in-place quantity stepper (`- 1 +`) when added.
  - Wishlist / Favorites bookmarking with persistent count.
- **Customizable Food Item Modal**:
  - Detailed ingredients, full description, and nutrition info.
  - Customizable add-ons (extra cheese, bacon, dips, sides) with live price adjustment.
- **Slide-Over Cart & Order Summary**:
  - Slide-out drawer with list of selected items and their custom add-ons.
  - Quantity controls and item removal.
  - Working promo voucher codes (`CRAVE20` for 20% off, `FREEDEL` for free delivery, `FEAST10` for $10 off).
  - Free delivery threshold progress bar ($35 goal).
  - Bill breakdown: Subtotal, Discount, Delivery Fee, Taxes (8%), and Total.
  - Delivery address input and special instructions.
- **Order Tracking & Live Status**:
  - Animated multi-step delivery status tracking: *Order Confirmed ➔ In the Kitchen ➔ Out for Delivery ➔ Arrived*.
  - Courier profile with mock contact options and order breakdown.

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

Open your browser at `http://localhost:3000` to view the app.

### 3. Build for production
```bash
npm run build
```
