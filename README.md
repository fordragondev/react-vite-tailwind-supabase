
# React Vite Tailwind Supabase Application

This project is a React-based single-page application (SPA) built using **Vite**, **Tailwind CSS**, and **Supabase** as the backend for authentication and data management. It allows users to log in and view company data from different countries.

## Features

- **User Authentication**: Sign in and out using Supabase's authentication API.
- **Responsive UI**: Tailwind CSS for responsive design, making the app mobile-friendly.
- **Supabase Integration**: Fetching and updating data stored in Supabase tables (`companies`, `countries`).
- **Login and Logout**: Implemented using Supabase's authentication hooks.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Vite**: Next-generation front-end tooling for fast development.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Supabase**: Backend-as-a-Service for database and authentication.
- **TypeScript**: For static type checking and improved code quality.

## Project Structure

Here is a high-level overview of the core components and files:

- **App.tsx**: Main component that manages authentication state and renders the user interface.
- **Auth.tsx**: Handles user authentication using Supabase.
- **Companies.tsx**: Displays top companies globally and lists companies filtered by country.
- **Countries.tsx**: Dropdown component that allows users to select a country.

## How to Run Locally
To run the project locally, follow these steps:

1. Clone the repository:
```
git clone https://github.com/your-username/react-tailwind-supabase.git  

Navigate to the project directory:
cd react-vite-tailwind-supabase
```
2. Install the dependencies (Tailwindcss and Supabase):
```
npm install
```
3. Set up your Supabase project and replace the supabaseClient file with your own credentials.  
In the root of the project, create a **.env file** and add your API Supabase credentials:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
4. Start the development server:
```
npm run dev
```

## Supabase Database Structure
- Go to Supabase and create an account.  
- Go to the SQL Editor page in the Dashboard.
- Click Quickstarts
  - Click `User Management Starter`, Run. (This table will be use for login using and email opt-link)
  - Click `Countries`, Run.

### Tables

1. **Countries Table**

   | Column   | Type    | Description               |
   | -------- | ------- | ------------------------- |
   | `id`     | Integer | Primary Key               |
   | `name`   | String  | Name of the country       |
   

2. **Companies Table**

   | Column       | Type    | Description                                       |
   | ------------ | ------- | ------------------------------------------------- |
   | `id`         | Integer | Primary Key                                       |
   | `country_id` | Integer | Foreign Key referencing `Countries` table         |
   | `name`       | String  | Name of the company                               |
   | `market_cap` | Integer | Market capitalization of the company              |

- Create table Companies Manually using the SQL Editor

   ```sql
    create table public.companies (
        id bigint generated always as identity primary key,
        country_id bigint references public.countries on delete cascade not null,
        name text not null,
        market_cap bigint not null
    );

- Insert data (not updated)

  ```sql
  comment on table companies is 'List of companies.';
  comment on column companies.name is 'Company name.';
  comment on column companies.market_cap is 'Company market cap.';
  insert into public.companies (country_id, name, market_cap) values
    (234, 'Apple', 2300000000000),
    (234, 'Microsoft', 2000000000000),
    (234, 'Amazon', 1700000000000),
    (234, 'Alphabet', 1500000000000),
    (54, 'Tencent', 500000000000),
    (54, 'Alibaba', 400000000000),
    (123, 'Samsung', 300000000000),
    (117, 'Sony', 100000000000),
    (90, 'SAP', 140000000000),
    (54, 'JD.com', 110000000000);

- Create policy

  ```sql
  create policy "Public companies are viewable only by authenticated users"
  on "public"."companies"
  as PERMISSIVE
  for SELECT
  to authenticated
  using (true);

### Relationships

- **Foreign Key**: `companies.country_id` references `countries.id`.

## Autor

**Andrés Echeverría**  
Fordragon Dev Company.