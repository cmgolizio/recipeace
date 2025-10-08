# Recipeace

Recipeace is a web application that helps users discover food and cocktail recipes based on the ingredients they already have on hand. By integrating data from both external and custom-built databases, Recipeace provides an intuitive and efficient way to minimize waste and maximize creativity in the kitchen and bar.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [APIs and Data Sources](#apis-and-data-sources)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Features

- **Personalized Pantry Management**
  Users can add and manage food ingredients in their digital pantry.

- **Smart Recipe Search**
  Recipeace fetches recipes from the Spoonacular API that match the user’s available ingredients.

- **Cocktail Discovery**
  Users can search for cocktails based on the ingredients they have. Cocktail data is fetched from a custom Supabase database.

- **Ingredient Validation**
  Ingredient names are validated against verified data from Spoonacular to ensure accuracy and consistency.

- **Secure Authentication**
  User authentication and session management are handled via Firebase Authentication.

- **Unified Interface**
  A clean, responsive UI built with TailwindCSS for a smooth and consistent experience across devices.

---

## Tech Stack

**Frontend Framework:** Next.js
**Authentication:** Firebase Authentication
**Database:** Firestore (for user data)
**External Database:** Supabase (for cocktails and ingredients)
**API Integration:** Spoonacular API (for food and ingredient data)
**HTTP Client:** Axios
**Styling:** TailwindCSS

---

## Architecture

The application’s architecture integrates multiple data sources through a unified Next.js frontend:

- **Firebase Auth** manages user sign-in and access control.
- **Firestore** stores user-specific data such as pantry contents.
- **Spoonacular API** provides real-time recipe and ingredient data for food recipes.
- **Supabase** hosts the project’s custom cocktail and ingredient database, accessible exclusively through Recipeace.
- **Next.js** manages server-side rendering and client-side routing for optimal performance and SEO.

---

## Installation and Setup

To run Recipeace locally:

```bash
# Clone the repository
git clone https://github.com/cmgolizio/recipeace.git

# Navigate into the project directory
cd recipeace

# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Usage

1. **Sign Up / Log In** using Firebase Authentication.
2. **Add Ingredients** to your digital pantry.
3. **Search for Recipes** that match the ingredients you have on hand.
4. **Explore Cocktails** using the integrated Supabase-powered cocktail database.

---

## APIs and Data Sources

- **[Spoonacular API](https://spoonacular.com/food-api)** – Used for food recipes, ingredient validation, and related data.
- **Supabase Database** – Custom-built and privately hosted; used for cocktail and ingredient data specific to Recipeace.

---

## Future Improvements

- Deployment via Vercel or Netlify
- User-generated recipes and cocktails
- Advanced filtering and sorting for search results
- Social sharing of recipe collections
- AI-assisted ingredient substitution suggestions

---

## Author

**Christopher Golizio**
[GitHub Profile](https://github.com/cmgolizio)
