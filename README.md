
# Fuel Management Web App

This is a code bundle for Fuel Management Web App. The original project is available at https://www.figma.com/design/Wd7JlWD3ZPr7ROguvXJzfb/Fuel-Management-Web-App.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Deployment

### Deploy to Vercel

This project is configured for seamless deployment on Vercel. You can deploy it in multiple ways:

#### Option 1: Deploy from GitHub (Recommended)

1. Push your code to GitHub (if not already done)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository `themanasante/fuel-web`
5. Vercel will automatically detect the Vite framework and use optimal settings
6. Click "Deploy"

#### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel`
4. Follow the prompts to configure your project

#### Configuration

The project includes a `vercel.json` file with the following optimizations:

- **SPA Routing**: All routes redirect to `index.html` for client-side routing
- **Asset Caching**: Static assets are cached for 1 year with immutable headers
- **Framework Detection**: Automatically detected as Vite project
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### Environment Variables

If your app requires environment variables, add them in the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add your variables for Production, Preview, and Development environments

### Local Preview

To preview the production build locally:

```bash
npm run build
npm run preview
```

### Scripts Available

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run linting (placeholder)
- `npm run type-check` - Run type checking (placeholder)

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React  