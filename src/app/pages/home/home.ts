import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly features: Feature[] = [
    {
      icon: '🔒',
      title: 'Secure Authentication',
      description: 'SHA1-based password hashing with configurable expiry times for enhanced security.'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Beautiful UI that works seamlessly across all devices and screen sizes.'
    },
    {
      icon: '⚡',
      title: 'Fast Performance',
      description: 'Built with Angular 20.3.0 using standalone components and signals for optimal performance.'
    },
    {
      icon: '🎨',
      title: 'Customizable',
      description: 'Easy to customize UI components, colors, and messages to match your brand.'
    },
    {
      icon: '🔧',
      title: 'Developer Friendly',
      description: 'Clean code architecture with comprehensive documentation and TypeScript support.'
    },
    {
      icon: '🚀',
      title: 'Production Ready',
      description: 'GitHub Actions workflow included for automated deployment to GitHub Pages.'
    }
  ];

  protected readonly stats = [
    { value: '20.3.0', label: 'Angular Version' },
    { value: '100%', label: 'TypeScript' },
    { value: 'SHA1', label: 'Encryption' },
    { value: 'Responsive', label: 'Design' }
  ];
}
