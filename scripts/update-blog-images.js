require('dotenv').config();
const { Client } = require('pg');

async function updateBlogPostImages() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    // Update Post 1: What is the Quantum?
    await client.query(
      'UPDATE blog_posts SET cover_image = $1 WHERE slug = $2',
      ['/quantum-basics.jpg', 'what-is-quantum']
    );
    console.log('✅ Updated: What is the Quantum? - cover image set to /quantum-basics.jpg');

    // Update Post 2: Quantum Computers
    await client.query(
      'UPDATE blog_posts SET cover_image = $1 WHERE slug = $2',
      ['/quantum-computers.jpg', 'quantum-computers']
    );
    console.log('✅ Updated: Quantum Computers - cover image set to /quantum-computers.jpg');

    // Update Post 3: Latest Updates
    await client.query(
      'UPDATE blog_posts SET cover_image = $1 WHERE slug = $2',
      ['/quantum-updates.jpg', 'quantum-technology-updates-2025']
    );
    console.log('✅ Updated: Latest Updates About Quantum Technology - cover image set to /quantum-updates.jpg');

    console.log('\n✅ All blog post cover images have been updated successfully!');
    await client.end();
  } catch (error) {
    console.error('❌ Error updating blog post images:', error);
    await client.end();
    process.exit(1);
  }
}

updateBlogPostImages();
