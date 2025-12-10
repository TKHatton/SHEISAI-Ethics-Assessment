# Netlify Deployment Guide - SHE IS AI Ethics Manual

## Prerequisites Checklist ✓

### Files Ready for Deployment
- ✅ `netlify.toml` - Build configuration created
- ✅ `package.json` - Contains `build` script
- ✅ `vite.config.ts` - Properly configured
- ✅ `.gitignore` - Environment files excluded
- ✅ `public/assets/` folder - Contains logo, favicon, hero image
- ✅ `public/assets/videos/` - Contains SHE_IS_AI__Ethics_of_Action.mp4 (35MB)
- ✅ `public/assets/team/` - Ready for team member photos
- ✅ Build tested successfully ✓

### Important: Public Folder Structure
All static assets MUST be in the `public/` folder for Vite to include them in the build:
```
public/
  assets/
    favicon.jpg
    hero.jpg
    SHEISAI-Logo-Black-Watermelon-on white.png
    videos/
      SHE_IS_AI__Ethics_of_Action.mp4
    team/
      [team member photos]
```

### Before Deploying

1. **Commit and Push Your Changes**
   ```bash
   git add .
   git commit -m "Prepare gemini-redesign branch for Netlify deployment"
   git push origin gemini-redesign
   ```

2. **Add Team Member Images**
   Ensure these files are in `assets/team/`:
   - headshot_ricquel.jpeg
   - headshot_amanda.jpeg
   - headshot_el.jpeg
   - headshot_anja.jpeg
   - headshot_dawn.jpeg
   - headshot_nagawa.jpeg
   - headshot_lyudmyla.jpeg
   - headshot_julia.jpeg
   - headshot_jamie.jpeg
   - headshot_lexi.jpeg
   - headshot_mo.jpeg

## Netlify Configuration Steps

### 1. Connect Repository
1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. **Important**: Select the `gemini-redesign` branch (not main)

### 2. Build Settings (Should auto-detect from netlify.toml)
- **Base directory**: Leave empty
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Branch**: `gemini-redesign`

### 3. Environment Variables (CRITICAL!)
Add these in Site settings → Environment variables:

**Required:**
- `VITE_OPENAI_API_KEY` = YOUR_API_KEY
  (Your OpenAI API key for the "Ask the Manual" chatbot)

**Note**: Supabase credentials are hardcoded in the app (safe for public anon key).

### 4. Deploy!
Click "Deploy site" and wait for the build to complete.

## Post-Deployment Checklist

After deployment, test these features:

### Core Features
- [ ] Homepage loads with hero image
- [ ] Navigation works across all pages
- [ ] Logo appears in header and footer
- [ ] Favicon shows in browser tab

### Pages
- [ ] Home page
- [ ] Principles page
- [ ] Frameworks page
- [ ] Global Impact page
- [ ] Team page (with all 11 members)
- [ ] Resources page (with video)
- [ ] Registration page
- [ ] Ask the Manual (chat assistant)

### Interactive Features
- [ ] Registration form submits successfully
- [ ] Confirmation email sends
- [ ] Video plays on Resources page
- [ ] "Ask the Manual" chatbot responds correctly
- [ ] "Apply to be an Ambassador" button links to https://sheisai.ai/ambassadors

### Assets
- [ ] All team member photos load
- [ ] Logo displays correctly
- [ ] Hero image displays
- [ ] Video file loads and plays

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are in package.json
- Verify Node version (should be 18+)

### Environment Variable Issues
- Chatbot not working? → Check VITE_OPENAI_API_KEY is set
- Variable changes require redeployment

### 404 on Routes
- netlify.toml redirect rule should handle this
- If issues persist, check the _redirects file was included in build

### Video Not Playing
- Check file size (35MB - should be fine)
- Verify file uploaded to Git LFS if repo has size limits
- Check browser console for loading errors

### Images Not Loading
- Verify all image files were committed to Git
- Check paths in code match actual filenames (case-sensitive)
- Look for 404 errors in browser Network tab

## Custom Domain (Optional)

To use a custom domain:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. SSL certificate will be provisioned automatically

## Branch Deployment Strategy

Since this is the `gemini-redesign` branch:
- You can keep this as a separate Netlify site for testing
- Or merge to `main` branch when ready for production
- Netlify supports branch deploys and deploy previews

## Performance Tips

- [ ] Enable Netlify's Asset Optimization
- [ ] Enable Netlify's Image Optimization (for faster loading)
- [ ] Consider enabling Netlify Analytics

## Notes

- **RAG System**: The vector database (manual_embeddings) is hosted on Supabase, so it's automatically available in production
- **Manual Updates**: You can update the manual content by running `npm run update-manual` locally (requires database access)
- **Email Function**: Supabase edge function `send-registration-email` should work in production automatically

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Ensure the gemini-redesign branch is up to date
