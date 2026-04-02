import { execSync } from 'child_process';

const commitMsg = process.argv[2] || `chore: automated sync at ${new Date().toLocaleString()}`;

console.log('--- Syncing GenMark to GitHub ---');

try {
  // Stage all changes
  console.log('Staging changes...');
  execSync('git add -A', { stdio: 'inherit' });

  // Check if there are any changes to commit
  const status = execSync('git status --porcelain').toString();
  if (!status) {
    console.log('No changes to sync.');
    process.exit(0);
  }

  // Commit
  console.log(`Committing changes with message: "${commitMsg}"`);
  execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });

  // Push
  console.log('Pushing to remote repository...');
  execSync('git push origin HEAD', { stdio: 'inherit' });

  console.log('Done!');
} catch (error) {
  console.error('Sync failed:', error.message);
  process.exit(1);
}
