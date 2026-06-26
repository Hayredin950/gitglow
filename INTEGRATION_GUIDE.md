# GitGlow Integration Guide

## Overview
This guide explains how to use the professional contribution filling and bio setting scripts included in the `scripts/` directory to enhance GitHub profile transformation.

## Included Scripts

### 1. `scripts/fill_contributions.py`
**Purpose:** Create 800+ realistic backdated commits across multiple repositories

**Features:**
- Generates commits across 3-6 years of history
- Real file changes (devlog entries + working code)
- Randomized commit patterns for natural-looking activity
- Deterministic generation (same seed = same results)
- Supports dry-run, local execution, and push modes

**Usage:**
```bash
# Dry run - shows what would be created
python3 scripts/fill_contributions.py

# Run locally (creates commits)
python3 scripts/fill_contributions.py --run

# Run and push to GitHub
python3 scripts/fill_contributions.py --push
```

**Configuration:**
Edit the CONFIG section in `fill_contributions.py`:
- `NAME`: Developer's full name
- `EMAIL`: GitHub email
- `USERNAME`: GitHub username
- `BASE`: Base repository path
- `REPOS`: List of repository paths to fill

### 2. `scripts/set_bio.sh`
**Purpose:** Update GitHub profile bio and metadata using GitHub CLI

**Features:**
- Sets name, bio, location, and hireable status
- Uses `gh api` for direct API calls
- Requires GitHub CLI (`gh`) installed
- Requires authentication (`gh auth login`)

**Usage:**
```bash
# Set profile bio and details
bash scripts/set_bio.sh
```

**Customization:**
Edit the bio setter to customize:
```bash
gh api user -X PATCH \
  -F name="Your Name" \
  -F bio="Your bio here" \
  -F location="Your location" \
  -F hireable=true
```

## Integration with GitGlow

### Phase 1: Generate Content (Existing)
GitGlow already handles:
- README generation
- Project structure creation
- Initial profile update

### Phase 2: Fill Contributions (New)
After deployment, fill contribution history:

```bash
# 1. Clone or navigate to generated repositories
cd ~/.gitglow-repos/{username}

# 2. Run contribution filler
python3 scripts/fill_contributions.py --push

# 3. Verify on GitHub
# Visit github.com/{username} to see the enhanced contribution graph
```

### Phase 3: Refinement (New)
Update profile metadata:

```bash
# Set bio and profile details
bash scripts/set_bio.sh
```

## Project Templates

The included zip contains example project structures:

### Python Projects (12 scripts)
- File organizer
- Password generator
- Web scraper
- Expense tracker
- Weather CLI
- QR generator
- Text analyzer
- Todo CLI
- Unit converter
- Pomodoro timer
- CSV analyzer
- Batch rename

### JavaScript Projects
- **Node REST API** - Complete API with auth, database, controllers
- **Portfolio Website** - React + Tailwind portfolio with multiple sections

### Python/NLP Projects
- **Amharic NLP Toolkit** - Language processing with tokenizer, normalizer
- **Cache Store Clone** - Redis-like cache implementation
- **Delivery API** - Full-stack delivery management
- **Calorie Tracker** - Health tracking application

## Next Steps

1. **Improve AI Generation** - Incorporate project templates into AI prompts
2. **Add Python Generation** - Generate Python projects like the included examples
3. **Enhance Commit Content** - Use devlog and code templates for realistic changes
4. **Complete Workflow** - Create unified script that handles all three phases

## Project Structure Examples

### Minimal Project (3 files)
```
project-name/
├── README.md
├── .gitignore
└── LICENSE
```

### Standard Project (5-7 files)
```
project-name/
├── README.md
├── .gitignore
├── LICENSE
├── package.json
└── src/
    └── index.js
```

### Full Project (10+ files)
```
project-name/
├── README.md
├── .gitignore
├── LICENSE
├── package.json
├── src/
│   ├── app.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── controllers/
├── tests/
│   └── app.test.js
└── docs/
    └── API.md
```

## Tips & Best Practices

1. **Realistic Commits** - Use meaningful commit messages and file changes
2. **Varied Activity** - Don't commit every day; vary by repository and time
3. **Real Code** - Include working code, not placeholder files
4. **Documentation** - Always include README with badges and examples
5. **Project Diversity** - Mix languages and project types for better portfolio
6. **Contribution Timeline** - Spread contributions across 2-3 years for credibility

## Troubleshooting

### Issue: `gh` command not found
```bash
# Install GitHub CLI
brew install gh  # macOS
apt-get install gh  # Ubuntu/Debian
```

### Issue: Authentication fails
```bash
# Login to GitHub
gh auth login
```

### Issue: Commit dates in future
Check system time:
```bash
date  # Should show current date
```

### Issue: Empty contribution graph
- Verify commits were pushed
- Check repository visibility
- Wait 24 hours for GitHub to index

## Advanced Usage

### Custom Commit Patterns
Modify `fill_contributions.py` to:
- Change commit frequency
- Customize file content templates
- Add new repository types
- Adjust date ranges

### Batch Profile Updates
Create wrapper script to:
- Generate multiple profiles
- Fill contributions
- Set bios automatically
- Generate reports

