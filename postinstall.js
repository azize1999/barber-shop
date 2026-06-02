#!/usr/bin/env node
/**
 * postinstall.js - Ensure Prisma client is generated after dependencies are installed
 * This runs automatically after `pnpm install` or `npm install`
 */

const { execSync } = require('child_process');

console.log('🔄 Generating Prisma client...');
try {
  execSync('prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.warn('⚠️ Warning: Failed to generate Prisma client');
  // Don't fail the build if prisma generate fails here
  // It will be generated again during the build process
}
