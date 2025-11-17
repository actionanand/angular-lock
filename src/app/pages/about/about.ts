import { Component } from '@angular/core';

interface Technology {
  name: string;
  version: string;
  description: string;
  icon: string;
}

interface TeamMember {
  name: string;
  role: string;
  icon: string;
}

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly technologies: Technology[] = [
    {
      name: 'Angular',
      version: '20.3.0',
      description: 'Modern web framework with standalone components and signals',
      icon: '🅰️'
    },
    {
      name: 'TypeScript',
      version: '5.7.2',
      description: 'Strongly typed programming language for better code quality',
      icon: '📘'
    },
    {
      name: 'SCSS',
      version: 'Latest',
      description: 'Advanced CSS with variables, nesting, and mixins',
      icon: '🎨'
    },
    {
      name: 'SHA1',
      version: 'Crypto',
      description: 'Secure password hashing algorithm',
      icon: '🔐'
    }
  ];

  protected readonly team: TeamMember[] = [
    { name: 'Developer', role: 'Full Stack Engineer', icon: '👨‍💻' },
    { name: 'Designer', role: 'UI/UX Specialist', icon: '👩‍🎨' },
    { name: 'Architect', role: 'Solution Designer', icon: '👨‍🏗️' },
    { name: 'Tester', role: 'QA Engineer', icon: '👩‍🔬' }
  ];

  protected readonly projectInfo = {
    version: '1.0.0',
    releaseDate: 'November 2025',
    license: 'MIT',
    repository: 'https://github.com/actionanand/angular-lock'
  };

  constructor() {
    console.log('About component loaded');
  }
}
