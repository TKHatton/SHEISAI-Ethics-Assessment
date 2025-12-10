/**
 * Script to update the Ethics Manual in the vector database
 *
 * Usage:
 *   1. Place your manual PDF in the project root as "ethics-manual.pdf"
 *   2. Run: npm run update-manual
 *
 * Or provide text content directly from a .txt file
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });
import {
  clearAllEmbeddings,
  processAndStoreDocument
} from '../services/embeddingService.js';

// For now, we'll use a simple text-based approach
// In the future, you can add PDF parsing libraries like pdf-parse

async function updateManualFromText(filePath: string) {
  try {
    console.log('🚀 Starting manual update process...\n');

    // Read the text file
    console.log(`📖 Reading manual from: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');

    if (!content || content.trim().length === 0) {
      throw new Error('Manual file is empty');
    }

    console.log(`✅ Read ${content.length} characters from manual\n`);

    // Clear existing embeddings
    console.log('🗑️  Clearing existing embeddings...');
    await clearAllEmbeddings();
    console.log('✅ Existing embeddings cleared\n');

    // Process and store the new content
    console.log('⚙️  Processing and storing manual chunks...');
    const result = await processAndStoreDocument(content, {
      title: 'SHE IS AI Ethics Manual',
      source: path.basename(filePath),
      updatedAt: new Date().toISOString()
    });

    console.log(`\n✅ Successfully processed ${result.chunksProcessed} chunks!`);
    console.log('\n🎉 Manual update complete! The AI will now use the latest version.\n');

  } catch (error) {
    console.error('❌ Error updating manual:', error);
    throw error;
  }
}

async function updateManualFromPDF(filePath: string) {
  console.log('📄 PDF support coming soon!');
  console.log('For now, please:');
  console.log('1. Open your PDF');
  console.log('2. Copy all text content');
  console.log('3. Paste into a .txt file');
  console.log('4. Run this script with the .txt file');
  console.log('\nOr we can install a PDF parsing library - let me know!');
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('📝 Usage: npm run update-manual <file-path>');
  console.log('\nExamples:');
  console.log('  npm run update-manual ethics-manual.txt');
  console.log('  npm run update-manual manual.pdf (coming soon)');
  console.log('\nMake sure your OpenAI API key is set in .env.local');
  process.exit(1);
}

const filePath = path.resolve(args[0]);

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

const ext = path.extname(filePath).toLowerCase();

if (ext === '.pdf') {
  updateManualFromPDF(filePath)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else if (ext === '.txt' || ext === '.md') {
  updateManualFromText(filePath)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  console.error(`❌ Unsupported file type: ${ext}`);
  console.log('Supported formats: .txt, .md (PDF support coming soon)');
  process.exit(1);
}
