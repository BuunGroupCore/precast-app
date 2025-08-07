#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gitDir = join(__dirname, '..', '.git');

if (existsSync(gitDir)) {
  try {
    execSync('git config core.hooksPath .husky', { stdio: 'inherit' });
    console.log('✅ Husky installed');
  } catch (error) {
    console.error('Failed to install Husky:', error.message);
    process.exit(1);
  }
} else {
  console.log('Not a git repository, skipping Husky installation');
}