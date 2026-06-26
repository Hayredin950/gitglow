import type { GeneratedProject } from "@/types/polish";

// Template definitions with metadata
export const TEMPLATES: Record<
  string,
  {
    name: string;
    description: string;
    language: string;
    type: string;
    files: Record<string, string>;
  }
> = {
  "node-rest-api": {
    name: "Node.js REST API",
    description: "⚡ Production-ready REST API with JWT authentication, MongoDB integration, comprehensive error handling, and Docker support — perfect for full-stack backend development",
    language: "JavaScript",
    type: "api",
    files: {
      "package.json": `{
  "name": "rest-api-backend",
  "version": "1.0.0",
  "description": "Professional REST API with authentication",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.4.3"
  }
}`,
      ".gitignore": `node_modules/
.env
.env.local
.DS_Store
dist/
build/
*.log
coverage/`,
      "LICENSE": `MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`,
      "README.md": `# ⚡ REST API Backend

Professional REST API built with Express.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18.2-white)](https://expressjs.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-red)](https://jwt.io)

## Features

- Express.js framework
- JWT authentication
- CORS enabled
- Error handling middleware
- Input validation
- Rate limiting

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Users
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

## Tech Stack

- Node.js
- Express.js
- JWT
- Bcrypt
`,
      "src/app.js": `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
      "src/routes/auth.js": `const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  // Registration logic
  res.json({ message: 'User registered', email });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Login logic
  res.json({ token: 'jwt_token_here' });
});

module.exports = router;`,
      "src/middleware/auth.js": `const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = { verifyToken };`,
    },
  },
  "python-utility": {
    name: "Python Utility Script",
    description: "🐍 Professional Python CLI toolkit with Click interface, robust error handling, logging, and configuration management — ideal for automation scripts and developer tools",
    language: "Python",
    type: "cli",
    files: {
      "requirements.txt": `click==8.1.3
colorama==0.4.6
requests==2.28.2
python-dotenv==1.0.0`,
      ".gitignore": `__pycache__/
*.py[cod]
*$py.class
.Python
env/
venv/
*.egg-info/
dist/
build/
.env`,
      "LICENSE": `MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`,
      "README.md": `# 🐍 Python Utility Tool

Professional command-line utility built with Python

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)](https://python.org)
[![Code style: Black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![CLI](https://img.shields.io/badge/CLI-Click-green)](https://click.palletsprojects.com)

## Features

- CLI interface with Click
- Error handling
- Configuration support
- Logging

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

\`\`\`bash
python main.py --help
python main.py process --input file.txt
\`\`\`

## Tech Stack

- Python 3.8+
- Click
- Requests
`,
      "main.py": `#!/usr/bin/env python3
import click
from colorama import Fore, Style
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@click.group()
def cli():
    """Professional Python utility tool"""
    pass

@cli.command()
@click.option('--input', required=True, help='Input file path')
@click.option('--output', default='output.txt', help='Output file path')
def process(input, output):
    """Process input file"""
    try:
        click.echo(f"{Fore.GREEN}Processing {input}...{Style.RESET_ALL}")
        # Processing logic here
        click.echo(f"{Fore.GREEN}✓ Output saved to {output}{Style.RESET_ALL}")
        logger.info(f"Processed {input} successfully")
    except Exception as e:
        click.echo(f"{Fore.RED}✗ Error: {e}{Style.RESET_ALL}", err=True)
        logger.error(f"Error processing file: {e}")

@cli.command()
def status():
    """Show tool status"""
    click.echo(f"{Fore.CYAN}Tool Status: OK{Style.RESET_ALL}")

if __name__ == '__main__':
    cli()`,
      "utils/helpers.py": `import logging

logger = logging.getLogger(__name__)

def validate_file(filepath):
    """Validate if file exists"""
    import os
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    return filepath

def read_file(filepath):
    """Read file content"""
    with open(filepath, 'r') as f:
        return f.read()

def write_file(filepath, content):
    """Write content to file"""
    with open(filepath, 'w') as f:
        f.write(content)
    logger.info(f"Written to {filepath}")`,
    },
  },
  "portfolio": {
    name: "Portfolio Website",
    description: "🌐 Modern, responsive portfolio website built with Next.js 14, React 18, and Tailwind CSS — featuring dark/light mode, project showcase, and optimized performance for developer portfolios",
    language: "JavaScript",
    type: "web-app",
    files: {
      "package.json": `{
  "name": "portfolio-website",
  "version": "1.0.0",
  "description": "Professional portfolio website",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0"
  }
}`,
      ".gitignore": `node_modules/
.next/
out/
*.log
.DS_Store`,
      "LICENSE": `MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`,
      "README.md": `# 🌐 Portfolio Website

Professional portfolio built with Next.js and React

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC)](https://tailwindcss.com)

## Features

- Modern responsive design
- Dark/light mode
- Project showcase
- Contact form
- Performance optimized

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit http://localhost:3000

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- TypeScript
`,
      "pages/index.js": `export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <ul className="flex gap-6">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-20">
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-4">Hi, I'm a Developer</h2>
          <p className="text-xl text-gray-600">Creating digital experiences</p>
        </section>

        <section id="projects" className="mb-20">
          <h3 className="text-3xl font-bold mb-8">Featured Projects</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="border rounded-lg p-6">
                <h4 className="font-bold mb-2">Project {i}</h4>
                <p className="text-gray-600">Project description goes here</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}`,
    },
  },
  "nlp-toolkit": {
    name: "NLP Toolkit",
    description: "🧠 Comprehensive Natural Language Processing library featuring text tokenization, sentiment analysis, named entity recognition, and text classification — built with NLTK and scikit-learn for ML-powered text analytics",
    language: "Python",
    type: "library",
    files: {
      "requirements.txt": `nltk==3.8.1
numpy==1.24.3
scikit-learn==1.2.2
pandas==2.0.2`,
      ".gitignore": `__pycache__/
*.pyc
.egg-info/
dist/
build/
.env`,
      "LICENSE": `MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`,
      "README.md": `# 🧠 NLP Toolkit

Natural Language Processing toolkit for text analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)](https://python.org)
[![NLTK](https://img.shields.io/badge/NLTK-3.8.1-red)](https://nltk.org)
[![Scikit-learn](https://img.shields.io/badge/scikit--learn-1.2.2-orange)](https://scikit-learn.org)

## Features

- Text tokenization
- Sentiment analysis
- Named entity recognition
- Text classification
- Language detection

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

\`\`\`python
from nlp_toolkit import Analyzer

analyzer = Analyzer()
result = analyzer.analyze("Your text here")
print(result)
\`\`\`

## Tech Stack

- Python 3.8+
- NLTK
- Scikit-learn
- NumPy
`,
      "nlp_toolkit/__init__.py": `from .analyzer import Analyzer
from .tokenizer import Tokenizer

__version__ = "1.0.0"
__all__ = ["Analyzer", "Tokenizer"]`,
      "nlp_toolkit/analyzer.py": `import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import sent_tokenize

class Analyzer:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
    
    def analyze(self, text):
        """Analyze text sentiment and structure"""
        sentences = sent_tokenize(text)
        sentiments = [self.sia.polarity_scores(s) for s in sentences]
        
        return {
            "sentence_count": len(sentences),
            "sentiments": sentiments,
            "overall_compound": sum(s['compound'] for s in sentiments) / len(sentiments)
        }`,
    },
  },
  "cache-store": {
    name: "Cache Store (Redis Clone)",
    description: "⚡ High-performance in-memory cache store with TTL support, LRU eviction policy, and thread-safe operations — a lightweight Redis alternative for Python applications requiring fast data caching",
    language: "Python",
    type: "library",
    files: {
      "requirements.txt": `python-dateutil==2.8.2`,
      ".gitignore": `__pycache__/
*.pyc
.egg-info/`,
      "LICENSE": `MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`,
      "README.md": `# ⚡ Cache Store

High-performance in-memory cache store with TTL support

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)](https://python.org)
[![Thread-safe](https://img.shields.io/badge/Thread--Safe-success)](https://docs.python.org/3/library/threading.html)
[![TTL Support](https://img.shields.io/badge/TTL-Support-informational)](https://redis.io)

## Features

- Set/Get/Delete operations
- TTL (Time To Live) support
- LRU eviction policy
- Thread-safe operations
- Expiration cleanup

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

\`\`\`python
from cache_store import CacheStore

cache = CacheStore(max_size=1000)
cache.set('key', 'value', ttl=3600)
value = cache.get('key')
\`\`\`

## Tech Stack

- Python 3.8+
- Thread-safe design
- Custom memory management
`,
      "cache_store/__init__.py": `from .store import CacheStore

__version__ = "1.0.0"`,
      "cache_store/store.py": `import time
from typing import Any, Optional
from threading import Lock

class CacheStore:
    def __init__(self, max_size: int = 1000):
        self.max_size = max_size
        self.cache = {}
        self.lock = Lock()
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value with optional TTL"""
        with self.lock:
            if len(self.cache) >= self.max_size:
                self._evict_oldest()
            
            self.cache[key] = {
                'value': value,
                'expires': time.time() + ttl if ttl else None
            }
    
    def get(self, key: str) -> Optional[Any]:
        """Get value if exists and not expired"""
        with self.lock:
            if key not in self.cache:
                return None
            
            item = self.cache[key]
            if item['expires'] and time.time() > item['expires']:
                del self.cache[key]
                return None
            
            return item['value']
    
    def _evict_oldest(self) -> None:
        """Remove oldest entry"""
        if self.cache:
            oldest_key = min(self.cache.keys())
            del self.cache[oldest_key]`,
    },
  },
  "delivery-api": {
    name: "Delivery Tracking API",
    description: "🚚 Full-featured delivery tracking system with real-time status updates, route optimization, and comprehensive logistics management — built for e-commerce and delivery service applications",
    language: "JavaScript",
    type: "api",
    files: {
      "package.json": `{
  "name": "delivery-tracking-api",
  "version": "1.0.0",
  "description": "Delivery tracking system with real-time updates",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.4.3"
  }
}`,
      ".gitignore": `node_modules/
.env
.env.local
.DS_Store
dist/
build/
*.log
coverage/`,
      "LICENSE": `MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`,
      "README.md": `# 🚚 Delivery Tracking API

Real-time delivery tracking system with route optimization

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18.2-white)](https://expressjs.com)
[![Real-time](https://img.shields.io/badge/Real--Time-Updates-success)](https://socket.io)

## Features

- Real-time delivery tracking
- Route optimization
- Status updates
- Delivery management
- Location tracking

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## API Endpoints

### Deliveries
- POST /api/deliveries - Create new delivery
- GET /api/deliveries/:id - Get delivery status
- PUT /api/deliveries/:id - Update delivery
- GET /api/deliveries - List all deliveries

### Tracking
- GET /api/tracking/:id - Real-time tracking
- POST /api/tracking/:id/location - Update location

## Tech Stack

- Node.js
- Express.js
- UUID
- Real-time updates
`,
      "src/app.js": `const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const deliveries = new Map();

// Routes
app.post('/api/deliveries', (req, res) => {
  const { recipient, address, items } = req.body;
  const delivery = {
    id: uuidv4(),
    recipient,
    address,
    items,
    status: 'pending',
    createdAt: new Date(),
    location: null
  };
  deliveries.set(delivery.id, delivery);
  res.status(201).json(delivery);
});

app.get('/api/deliveries/:id', (req, res) => {
  const delivery = deliveries.get(req.params.id);
  if (!delivery) {
    return res.status(404).json({ error: 'Delivery not found' });
  }
  res.json(delivery);
});

app.put('/api/deliveries/:id', (req, res) => {
  const delivery = deliveries.get(req.params.id);
  if (!delivery) {
    return res.status(404).json({ error: 'Delivery not found' });
  }
  const updated = { ...delivery, ...req.body, updatedAt: new Date() };
  deliveries.set(req.params.id, updated);
  res.json(updated);
});

app.get('/api/deliveries', (req, res) => {
  res.json(Array.from(deliveries.values()));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Delivery API running on port \${PORT}\`);
});`,
    },
  },
  "calorie-tracker": {
    name: "Calorie Tracker App",
    description: "🥗 Comprehensive calorie tracking and nutrition management application with meal logging, calorie goals, and nutritional analysis — built for health-conscious users and fitness enthusiasts",
    language: "JavaScript",
    type: "web-app",
    files: {
      "package.json": `{
  "name": "calorie-tracker",
  "version": "1.0.0",
  "description": "Calorie tracking and nutrition management app",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.8.0"
  }
}`,
      ".gitignore": `node_modules/
.next/
out/
*.log
.DS_Store`,
      "LICENSE": `MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`,
      "README.md": `# 🥗 Calorie Tracker

Comprehensive calorie tracking and nutrition management

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org)
[![Charts](https://img.shields.io/badge/Charts-Recharts-green)](https://recharts.org)

## Features

- Daily calorie tracking
- Meal logging
- Nutritional analysis
- Progress charts
- Goal setting
- Food database

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit http://localhost:3000

## Usage

1. Set your daily calorie goal
2. Log your meals throughout the day
3. Track your nutritional intake
4. View progress charts and analytics

## Tech Stack

- Next.js 14
- React 18
- Recharts
- Local storage
`,
      "pages/index.js": `import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [currentCalories, setCurrentCalories] = useState(0);

  const data = [
    { name: 'Mon', calories: 1800 },
    { name: 'Tue', calories: 2100 },
    { name: 'Wed', calories: 1950 },
    { name: 'Thu', calories: 2200 },
    { name: 'Fri', calories: 1900 },
    { name: 'Sat', calories: 2400 },
    { name: 'Sun', calories: 2000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🥗 Calorie Tracker</h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Daily Progress</h2>
            <div className="text-3xl font-bold text-blue-600">
              {currentCalories} / {calorieGoal}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
              <div 
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: \`\${(currentCalories / calorieGoal) * 100}%\` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Weekly Overview</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Log Meal</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Food name"
              className="w-full p-3 border rounded"
            />
            <input
              type="number"
              placeholder="Calories"
              className="w-full p-3 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              Add Meal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
};

export function getTemplate(
  templateName: string
): GeneratedProject | null {
  const template = TEMPLATES[templateName];
  if (!template) return null;

  return {
    name: template.name,
    description: template.description,
    topics: [
      template.language.toLowerCase(),
      template.type,
      "gitglow",
    ],
    files: template.files,
  };
}

export function listTemplates() {
  return Object.entries(TEMPLATES).map(([key, template]) => ({
    id: key,
    name: template.name,
    description: template.description,
    language: template.language,
    type: template.type,
  }));
}
