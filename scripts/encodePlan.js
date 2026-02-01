/**
 * Script to Base64 encode a raid plan JSON file
 *
 * Usage: node scripts/encodePlan.js [path-to-json]
 * Default: encodes data/samplePlan.json
 *
 * Output: Prints the Base64 encoded string to console for copy/paste
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the file path from command line args or use default
const inputPath = process.argv[2] || resolve(__dirname, '../data/samplePlan.json');

try {
  // Read the JSON file
  const jsonContent = readFileSync(inputPath, 'utf-8');

  // Parse to validate it's valid JSON
  const plan = JSON.parse(jsonContent);

  // Re-stringify to minify (remove whitespace)
  const minified = JSON.stringify(plan);

  // Base64 encode
  const base64 = Buffer.from(minified, 'utf-8').toString('base64');

  console.log('\n========================================');
  console.log('XRT - Base64 Encoded Plan');
  console.log('========================================\n');
  console.log('Source:', inputPath);
  console.log('Fight:', plan.fightName || 'Unknown');
  console.log('Entries:', plan.timeline?.length || 0);
  console.log('\n----------------------------------------');
  console.log('BASE64 STRING (copy this):');
  console.log('----------------------------------------\n');
  console.log(base64);
  console.log('\n----------------------------------------\n');
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`Error: File not found: ${inputPath}`);
  } else if (error instanceof SyntaxError) {
    console.error(`Error: Invalid JSON in file: ${inputPath}`);
    console.error(error.message);
  } else {
    console.error('Error:', error.message);
  }
  process.exit(1);
}
