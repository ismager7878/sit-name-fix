# Deployment Guide

## Deploying to Render

### Prerequisites
- GitHub repository with your code
- Render account (free tier available)

### Deployment Steps

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository

2. **Connect to Render**:
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

3. **Configure Build Settings**:
   - **Build Command**: `npm run build:prod`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: Yes (recommended)

4. **Environment Variables** (if needed):
   - No special environment variables required for this project

5. **Deploy**: Click "Create Static Site"

### Alternative: Manual Deployment

If you prefer manual deployment:

```bash
# Build the project locally
npm run build:prod

# The built files will be in the 'dist' directory
# Upload the contents of 'dist' to your hosting service
```

### Build Configuration

- **Framework**: Angular
- **Node Version**: 18+ (specified in package.json engines)
- **Build Command**: `npm run build:prod`
- **Output Directory**: `dist`

### Important Notes

1. **Owlbear Rodeo Integration**: This extension is designed to work within the Owlbear Rodeo platform
2. **Manifest Location**: The `manifest.json` file must be accessible at the root URL (e.g., `https://your-site.com/manifest.json`)
3. **CORS**: Make sure your hosting domain is allowed in Owlbear Rodeo's extension settings
4. **HTTPS**: Owlbear Rodeo requires HTTPS for extensions (Render provides this automatically)

### Registering Your Extension with Owlbear Rodeo

After deployment, register your extension:

1. Go to [extensions.owlbear.rodeo](https://extensions.owlbear.rodeo)
2. Click "Add Extension" 
3. Enter your hosted URL: `https://your-app-name.onrender.com`
4. Owlbear Rodeo will automatically detect and load your `manifest.json`

### Troubleshooting

- **Build Fails**: Check that all dependencies are properly listed in package.json
- **Routing Issues**: The `_redirects` file should handle SPA routing
- **Extension Not Loading**: Verify the hosted URL is accessible and uses HTTPS

### Local Testing

Before deploying, test the production build locally:

```bash
npm run build:prod
# Serve the dist folder with a local server to test
```
