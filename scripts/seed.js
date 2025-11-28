require('dotenv').config();
const { Client } = require('pg');

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const slug = 'security-in-ai-and-mcp';
  const check = await client.query('SELECT id FROM blog_posts WHERE slug = $1', [slug]);
  if (check.rows.length > 0) {
    console.log('Sample blog post already exists, skipping.');
    await client.end();
    return;
  }

  const content = `As AI systems become integral to modern applications, securing the entire
AI lifecycle—data, models, and control planes—is essential. Model Control
Planes (MCPs) are responsible for model deployment, monitoring, and
access, so they must be part of a comprehensive security strategy.

Key considerations:\n\n1. Data Security: Encrypt data at rest and in transit, use least-privilege
access, and store sensitive data only when needed. Adopt differential
privacy and data minimization to reduce sensitive exposure.\n\n2. Model Hardening: Protect model IP and weights with access controls and
avoid hard-coding secrets. Consider model watermarking and integrity
attestation (e.g., signatures) to ensure the deployed model hasn't been
tampered with.\n\n3. Authentication & Authorization: Use strong authentication and role-based
access control for both human operators and services. Limit who can deploy
or modify models, and log all privileged actions.\n\n4. Supply Chain & Dependencies: Use vetted, minimal runtime dependencies and
pinned versions for reproducible builds. Scan for known vulnerabilities
regularly.\n\n5. Monitoring & Observability: Continuously monitor model performance and
input distributions. Use canary releases, anomaly detection, and alerts to
catch drift or exploitation attempts early.\n\n6. Secure MCP Practices: Harden the MCP itself—patch regularly, isolate
components, and secure its APIs. Encrypt secrets and use hardware-based
isolation for sensitive workloads when possible.\n\n7. Incident Response & Governance: Define response plans for adversarial
attacks and data breaches. Keep detailed audit trails, and ensure governance
checks before releasing high-risk models.\n\nBy aligning secure-by-default principles across data, models, and the MCP,
organizations can reduce attack surfaces and build trust in AI systems.`;

  const insertSQL = `INSERT INTO public.blog_posts (title, slug, excerpt, content, cover_image, author, read_time)
    VALUES($1, $2, $3, $4, $5, $6, $7)`;

  const values = [
    'Security in AI and MCP: Practical Guidance for Safe Deployments',
    slug,
    'A concise guide to securing AI models, data, and the model control plane (MCP).',
    content,
    null,
    'Security Team',
    '6 min',
  ];

  await client.query(insertSQL, values);
  console.log('Inserted sample blog post.');
  await client.end();
}

seed().catch((err) => { console.error(err); process.exit(1); });
