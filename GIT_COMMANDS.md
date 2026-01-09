# Git Commands for FlashBites Deployment

## 📦 Initial Setup (First Time)

### Initialize Git Repository
```bash
cd /Users/aman/Downloads/Prgramming/FlashBites
git init
git add .
git commit -m "Initial commit: FlashBites v1.0"
```

---

## 🔀 Create GitHub Repository

### Option 1: Create on GitHub.com
1. Go to https://github.com/new
2. Repository name: `flashbites` (or your choice)
3. Description: "Food delivery platform with real-time order tracking"
4. Keep it Private (or Public)
5. **Don't** initialize with README (you already have files)
6. Click "Create repository"

### Option 2: Using GitHub CLI (if installed)
```bash
gh repo create flashbites --private --source=. --remote=origin
```

---

## 🚀 Connect Local to GitHub

### After creating repo on GitHub, connect it:
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/flashbites.git
git branch -M main
git push -u origin main
```

---

## 📂 Separate Repositories (Recommended for Deployment)

### Backend Repository
```bash
cd backend
git init
git add .
git commit -m "Backend: Node.js + Express + MongoDB"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flashbites-backend.git
git push -u origin main
```

### Frontend Repository
```bash
cd frontend
git init
git add .
git commit -m "Frontend: React + Vite + Redux"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flashbites-frontend.git
git push -u origin main
```

---

## 🔄 Daily Git Workflow

### Check Status
```bash
git status
```

### Stage Changes
```bash
# Stage all changes
git add .

# Stage specific file
git add path/to/file

# Stage specific folder
git add src/
```

### Commit Changes
```bash
# With message
git commit -m "Add payment integration"

# Detailed commit
git commit -m "Feature: Razorpay payment integration" -m "- Added payment controller
- Integrated Razorpay SDK
- Added signature verification
- Updated order flow"
```

### Push to GitHub
```bash
# First time
git push -u origin main

# After that
git push
```

---

## 🌿 Branch Management

### Create New Branch
```bash
# Create and switch
git checkout -b feature/restaurant-dashboard

# Create only
git branch feature/order-tracking
```

### Switch Branches
```bash
git checkout main
git checkout feature/restaurant-dashboard
```

### Merge Branch
```bash
# Switch to main first
git checkout main

# Merge feature branch
git merge feature/restaurant-dashboard
```

### Delete Branch
```bash
# Delete local branch
git branch -d feature/restaurant-dashboard

# Force delete
git branch -D feature/restaurant-dashboard

# Delete remote branch
git push origin --delete feature/restaurant-dashboard
```

---

## 📥 Pull Latest Changes

```bash
# Pull from main branch
git pull origin main

# Pull from specific branch
git pull origin develop
```

---

## 🔍 View History

### View Commits
```bash
# All commits
git log

# One line per commit
git log --oneline

# Last 5 commits
git log -5

# With graph
git log --graph --oneline --all
```

### View Changes
```bash
# Uncommitted changes
git diff

# Staged changes
git diff --staged

# Changes in specific file
git diff src/App.jsx
```

---

## ↩️ Undo Changes

### Unstage Files
```bash
# Unstage specific file
git reset HEAD path/to/file

# Unstage all
git reset HEAD .
```

### Discard Changes
```bash
# Discard changes in file
git checkout -- path/to/file

# Discard all changes
git checkout -- .
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

---

## 🏷️ Tags (For Releases)

### Create Tag
```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"
```

### Push Tags
```bash
# Push specific tag
git push origin v1.0.0

# Push all tags
git push origin --tags
```

### List Tags
```bash
git tag
```

---

## 🔧 Configuration

### Set User Info
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### View Config
```bash
git config --list
```

---

## 📦 For FlashBites Deployment

### Step-by-Step for Railway/Vercel

#### 1. Create Two Separate Repos (Recommended)

**Backend Repo:**
```bash
cd /Users/aman/Downloads/Prgramming/FlashBites/backend
git init
git add .
git commit -m "Backend: FlashBites API

- Express 5 server
- MongoDB + Mongoose
- JWT authentication
- Razorpay payment gateway
- Cloudinary image uploads
- Email notifications
- Security middleware"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flashbites-backend.git
git push -u origin main
```

**Frontend Repo:**
```bash
cd /Users/aman/Downloads/Prgramming/FlashBites/frontend
git init
git add .
git commit -m "Frontend: FlashBites Web App

- React 18 + Vite
- Redux Toolkit
- Razorpay integration
- Responsive design
- Order tracking
- Real-time updates"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flashbites-frontend.git
git push -u origin main
```

#### 2. Deploy to Railway (Backend)
- Go to railway.app
- Sign in with GitHub
- New Project → Deploy from GitHub
- Select `flashbites-backend` repo
- Railway will auto-deploy!

#### 3. Deploy to Vercel (Frontend)
- Go to vercel.com
- Sign in with GitHub
- New Project → Import
- Select `flashbites-frontend` repo
- Vercel will auto-deploy!

---

## 🚨 Common Issues & Solutions

### Problem: "fatal: not a git repository"
```bash
# Solution: Initialize git
git init
```

### Problem: "rejected - non-fast-forward"
```bash
# Solution: Pull first, then push
git pull origin main --rebase
git push origin main
```

### Problem: "Permission denied (publickey)"
```bash
# Solution: Use HTTPS or set up SSH key
# Use HTTPS URL instead:
git remote set-url origin https://github.com/USERNAME/repo.git
```

### Problem: "Updates were rejected"
```bash
# Solution: Force push (careful!)
git push -f origin main

# Or pull and merge
git pull origin main
git push origin main
```

### Problem: Large files error
```bash
# Solution: Add to .gitignore
echo "node_modules/" >> .gitignore
echo "*.log" >> .gitignore
git rm -r --cached node_modules/
git commit -m "Remove node_modules"
git push
```

---

## 📋 Quick Reference

### Most Used Commands
```bash
git status                  # Check status
git add .                   # Stage all changes
git commit -m "message"     # Commit changes
git push                    # Push to remote
git pull                    # Pull from remote
git log --oneline          # View history
git checkout -b new-branch # Create & switch branch
```

### Before Deployment
```bash
# Make sure everything is committed
git status

# Create a release tag
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin --tags

# Verify .gitignore
cat .gitignore
# Should include: node_modules, .env, *.log, dist, build
```

---

## 🎯 Ready to Push?

### Final Checklist Before Push:
- [ ] `.gitignore` includes node_modules, .env, *.log
- [ ] No sensitive data in code (API keys, passwords)
- [ ] All tests passing (if you have tests)
- [ ] README.md is updated
- [ ] Environment variables documented

### Push Command:
```bash
# From FlashBites root
cd /Users/aman/Downloads/Prgramming/FlashBites

# If you want one monorepo
git init
git add .
git commit -m "Initial commit: FlashBites food delivery platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flashbites.git
git push -u origin main
```

### Or Separate Repos (Better for deployment):
```bash
# Backend
cd backend
git init
git add .
git commit -m "Backend: Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/flashbites-backend.git
git push -u origin main

# Frontend
cd ../frontend
git init
git add .
git commit -m "Frontend: Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/flashbites-frontend.git
git push -u origin main
```

---

## 🎉 Done!

After pushing to GitHub:
1. Go to Railway → New Project → Deploy from GitHub → Select backend repo
2. Go to Vercel → New Project → Import → Select frontend repo
3. Your app will be live in 10 minutes!

Good luck! 🚀
