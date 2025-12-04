require('dotenv').config();
const { Client } = require('pg');

async function addPhishingPost() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const slug = 'phishing-attacks-prevention-guide';
  const check = await client.query('SELECT id FROM blog_posts WHERE slug = $1', [slug]);
  
  if (check.rows.length > 0) {
    console.log('Phishing blog post already exists, updating...');
    const updateSQL = `UPDATE blog_posts SET title = $1, excerpt = $2, content = $3, cover_image = $4, author = $5, read_time = $6, updated_at = NOW() WHERE slug = $7`;
    
    const values = [
      'Phishing Attacks: What They Are and How to Prevent Severe Impact',
      'Comprehensive guide to understanding phishing attacks, their impact, and practical prevention strategies.',
      getPhishingContent(),
      null,
      'Chaval - AI Security Protector',
      '10 min',
      slug
    ];
    
    await client.query(updateSQL, values);
    console.log('Updated phishing blog post.');
  } else {
    console.log('Creating new phishing blog post...');
    const insertSQL = `INSERT INTO public.blog_posts (title, slug, excerpt, content, cover_image, author, read_time, created_at)
      VALUES($1, $2, $3, $4, $5, $6, $7, NOW())`;

    const values = [
      'Phishing Attacks: What They Are and How to Prevent Severe Impact',
      slug,
      'Comprehensive guide to understanding phishing attacks, their impact, and practical prevention strategies.',
      getPhishingContent(),
      null,
      'Chaval - AI Security Protector',
      '10 min'
    ];

    await client.query(insertSQL, values);
    console.log('Inserted phishing blog post.');
  }
  
  await client.end();
}

function getPhishingContent() {
  return `<h2>What is Phishing?</h2>
<p>Phishing is a form of social engineering attack where cybercriminals attempt to deceive users into revealing sensitive information or downloading malware by impersonating a trusted source. These attacks typically occur via email, but can also happen through text messages (smishing), phone calls (vishing), or fake websites.</p>

<p>The term "phishing" derives from the practice of casting a wide net and waiting for victims to "bite" on malicious hooks. Attackers often use sophisticated tactics to make fraudulent communications appear legitimate, targeting both individuals and organizations.</p>

<h2>Types of Phishing Attacks</h2>

<h3>1. Email Phishing</h3>
<p>The most common form of phishing attack, typically featuring:</p>
<ul>
<li>Fraudulent links that redirect to fake login pages</li>
<li>Malicious attachments containing malware or ransomware</li>
<li>Urgent calls to action ("Verify your account immediately")</li>
<li>Spoofed sender addresses mimicking trusted companies</li>
<li>Poorly formatted grammar and suspicious domain names</li>
</ul>

<h3>2. Spear Phishing</h3>
<p>Targeted phishing attacks directed at specific individuals or organizations. Attackers conduct extensive research to gather personal details, making messages highly personalized and convincing. These attacks often target:</p>
<ul>
<li>C-level executives and high-ranking officials</li>
<li>Finance and HR departments</li>
<li>Key employees with access to sensitive data</li>
<li>Information used includes: name, job title, company details, relationships</li>
</ul>

<h3>3. Whaling</h3>
<p>A sophisticated form of spear phishing targeting senior executives ("whale" targets). These attacks are carefully crafted to appear as urgent business matters, often impersonating board members or external partners. Whaling attacks frequently involve:</p>
<ul>
<li>CEO fraud and impersonation</li>
<li>Wire transfer requests</li>
<li>Sensitive contract demands</li>
<li>High-value data extraction requests</li>
</ul>

<h3>4. Smishing (SMS Phishing)</h3>
<p>Phishing attacks delivered via text messages. Increasingly common as attackers exploit the trust people place in SMS communications:</p>
<ul>
<li>Fake bank alerts about suspicious activity</li>
<li>Package delivery notifications with malicious links</li>
<li>Prize notifications and lottery scams</li>
<li>Two-factor authentication code requests</li>
</ul>

<h3>5. Vishing (Voice Phishing)</h3>
<p>Phishing attacks conducted via phone calls. Attackers use social engineering to manipulate victims into disclosing sensitive information:</p>
<ul>
<li>Impersonating IT support requesting credentials</li>
<li>Fake security alerts claiming account compromise</li>
<li>Pretexting as government agencies or financial institutions</li>
<li>Social engineering to gain access to physical locations</li>
</ul>

<h3>6. Clone Phishing</h3>
<p>Creating an exact duplicate of a previously sent legitimate email and modifying it with malicious links or attachments. Often used when attackers have intercepted previous communications. The email appears to be a re-transmission of a trusted message.</p>

<h3>7. Business Email Compromise (BEC)</h3>
<p>Sophisticated attacks targeting organizations by compromising business email accounts or impersonating executives. BEC attacks often result in:</p>
<ul>
<li>Unauthorized wire transfers (average loss: $130,000+)</li>
<li>Employee data breaches</li>
<li>Intellectual property theft</li>
<li>Invoice fraud and payment manipulation</li>
</ul>

<h2>Severe Impact of Phishing Attacks</h2>

<h3>Financial Impact</h3>
<p><strong>Direct Losses:</strong> Organizations lose billions annually to phishing attacks. The average cost of a phishing attack is $1.6 million per incident when factoring in recovery, downtime, and remediation.</p>

<p><strong>Incident Response Costs:</strong> Immediate expenses include forensic investigation, legal consultation, notification to affected parties, and credit monitoring services.</p>

<p><strong>Regulatory Fines:</strong> Non-compliance with GDPR, HIPAA, PCI-DSS, and other regulations can result in penalties up to 4% of annual revenue or $20 million (whichever is higher).</p>

<h3>Data Breach Consequences</h3>
<p>Successful phishing attacks frequently serve as entry points for major data breaches:</p>
<ul>
<li>Exposure of personally identifiable information (PII)</li>
<li>Health records and medical information compromise</li>
<li>Financial account details and payment methods</li>
<li>Intellectual property and trade secrets disclosure</li>
<li>Customer and employee data harvesting</li>
</ul>

<h3>Business Continuity Disruption</h3>
<p>Phishing-delivered malware can severely disrupt operations:</p>
<ul>
<li><strong>Ransomware Deployment:</strong> Encryption of critical systems with high ransom demands (often $100K-$1M+)</li>
<li><strong>System Downtime:</strong> Extended outages affecting productivity and customer service</li>
<li><strong>Supply Chain Impact:</strong> Disruption affecting customers, partners, and third-party vendors</li>
<li><strong>Recovery Time:</strong> Weeks to months to restore systems and normal operations</li>
</ul>

<h3>Reputational Damage</h3>
<p>Phishing attacks and subsequent breaches damage organizational reputation:</p>
<ul>
<li>Loss of customer trust and confidence</li>
<li>Negative media coverage and public scrutiny</li>
<li>Stock price decline and investor confidence loss</li>
<li>Difficulty recruiting and retaining talent</li>
<li>Long-term competitive disadvantage in the market</li>
</ul>

<h3>Compliance and Legal Issues</h3>
<p>Organizations must address multiple compliance burdens following phishing-related breaches:</p>
<ul>
<li>Mandatory breach notifications to regulatory bodies and affected individuals</li>
<li>Legal liability from class-action lawsuits</li>
<li>Enhanced compliance requirements and audits</li>
<li>Contractual breach notifications to partners and customers</li>
</ul>

<h2>How to Prevent Phishing Attacks</h2>

<h3>1. Technical Controls</h3>

<h4>Email Security Solutions</h4>
<ul>
<li><strong>Anti-Phishing Filters:</strong> Deploy advanced email filtering with machine learning to detect suspicious emails before they reach inboxes</li>
<li><strong>DMARC/SPF/DKIM:</strong> Implement email authentication protocols to prevent domain spoofing</li>
<li><strong>URL Rewriting:</strong> Rewrite suspicious URLs to prevent access to malicious sites</li>
<li><strong>Sandbox Analysis:</strong> Detonate suspicious attachments in isolated environments to detect malware</li>
</ul>

<h4>Multi-Factor Authentication (MFA)</h4>
<ul>
<li>Require MFA for all critical accounts and applications</li>
<li>Use hardware security keys for high-risk accounts</li>
<li>Implement risk-based authentication with adaptive MFA</li>
<li>Disable legacy authentication methods</li>
</ul>

<h4>Endpoint Protection</h4>
<ul>
<li>Deploy endpoint detection and response (EDR) solutions</li>
<li>Enable real-time malware protection and scanning</li>
<li>Maintain updated antivirus and anti-malware software</li>
<li>Use behavioral analysis to detect suspicious activities</li>
</ul>

<h4>Web and DNS Filtering</h4>
<ul>
<li>Block known malicious domains and sites</li>
<li>Implement DNS filtering to prevent access to phishing sites</li>
<li>Use secure web gateways to inspect HTTPS traffic</li>
<li>Maintain blocklists of malicious IPs and domains</li>
</ul>

<h3>2. User Awareness and Training</h3>

<h4>Regular Security Awareness Training</h4>
<ul>
<li>Conduct monthly or quarterly training sessions on phishing identification</li>
<li>Include real-world examples and case studies</li>
<li>Train users to recognize red flags: urgent language, unknown senders, requests for sensitive info</li>
<li>Educate on social engineering tactics and manipulation techniques</li>
</ul>

<h4>Simulated Phishing Campaigns</h4>
<ul>
<li>Run regular phishing simulations to test employee awareness</li>
<li>Track click rates and reporting metrics</li>
<li>Provide immediate feedback and re-training for those who click</li>
<li>Celebrate and incentivize employees who report suspicious emails</li>
</ul>

<h4>Clear Reporting Procedures</h4>
<ul>
<li>Make it easy for employees to report phishing emails (one-click reporting buttons)</li>
<li>Establish a dedicated security team to respond to reports</li>
<li>Provide prompt feedback to reporters</li>
<li>Remove reported emails from other users' inboxes quickly</li>
</ul>

<h3>3. Organizational Policies and Procedures</h3>

<h4>Password Management</h4>
<ul>
<li>Require strong, unique passwords (minimum 12 characters, complexity requirements)</li>
<li>Implement password managers for secure credential storage</li>
<li>Enforce regular password changes for high-risk accounts</li>
<li>Prohibit password sharing and reuse across systems</li>
</ul>

<h4>Least Privilege Access</h4>
<ul>
<li>Grant users only the minimum permissions necessary for their roles</li>
<li>Regularly audit and review user access rights</li>
<li>Implement privileged access management (PAM) solutions</li>
<li>Require approval for elevated privileges</li>
</ul>

<h4>Data Loss Prevention (DLP)</h4>
<ul>
<li>Monitor and control sensitive data exfiltration</li>
<li>Block emails containing sensitive patterns (credit cards, SSNs, health data)</li>
<li>Implement watermarking and document tracking</li>
<li>Use DLP to identify and respond to suspicious data transfers</li>
</ul>

<h4>Incident Response Plan</h4>
<ul>
<li>Develop a comprehensive incident response plan specifically for phishing attacks</li>
<li>Define clear roles and responsibilities</li>
<li>Establish communication protocols for breach notifications</li>
<li>Conduct regular tabletop exercises and drills</li>
</ul>

<h3>4. Advanced Detection and Response</h3>

<h4>Security Information and Event Management (SIEM)</h4>
<ul>
<li>Centralize log collection and analysis</li>
<li>Create alerts for suspicious email patterns and access</li>
<li>Monitor for lateral movement after initial compromise</li>
<li>Track authentication failures and anomalies</li>
</ul>

<h4>User and Entity Behavior Analytics (UEBA)</h4>
<ul>
<li>Establish baselines for normal user behavior</li>
<li>Detect anomalies like unusual login times or access patterns</li>
<li>Alert on suspicious file access or data transfers</li>
<li>Identify compromised accounts through behavioral changes</li>
</ul>

<h4>Threat Intelligence Integration</h4>
<ul>
<li>Subscribe to threat feeds about emerging phishing campaigns</li>
<li>Monitor for indicators of compromise (IoCs)</li>
<li>Participate in information sharing communities</li>
<li>Stay informed about phishing trends targeting your industry</li>
</ul>

<h3>5. AI and Machine Learning Solutions</h3>

<h4>Advanced Threat Detection</h4>
<ul>
<li>Use AI to identify zero-day phishing attempts using behavioral patterns</li>
<li>Implement machine learning models trained on millions of emails</li>
<li>Detect sophisticated impersonation attacks</li>
<li>Identify anomalous attachment patterns and file types</li>
</ul>

<h4>Natural Language Processing (NLP)</h4>
<ul>
<li>Analyze email content for linguistic patterns of phishing</li>
<li>Detect obfuscation techniques and encoded payloads</li>
<li>Identify urgency language and social engineering tactics</li>
<li>Flag suspicious writing style variations from known senders</li>
</ul>

<h2>Red Flags: How to Spot a Phishing Email</h2>

<h3>Content Indicators</h3>
<ul>
<li><strong>Urgent Language:</strong> "Act immediately," "Verify now," "Your account will be closed"</li>
<li><strong>Unusual Requests:</strong> Asking for passwords, personal information, or financial details</li>
<li><strong>Generic Greetings:</strong> "Dear Customer" instead of your actual name</li>
<li><strong>Poor Grammar/Spelling:</strong> Professional companies proofread their communications</li>
<li><strong>Mismatched Sender:</strong> Display name doesn't match email address</li>
<li><strong>Threats or Scare Tactics:</strong> Warnings about account suspension or illegal activity</li>
</ul>

<h3>Technical Indicators</h3>
<ul>
<li><strong>Suspicious Links:</strong> Hover over links to see actual URL (not the display text)</li>
<li><strong>Fake Domain Names:</strong> amazon-verify.com instead of amazon.com</li>
<li><strong>Shortened URLs:</strong> bit.ly, tinyurl (hide actual destination)</li>
<li><strong>IP Addresses:</strong> Links using IP addresses instead of domain names</li>
<li><strong>HTTPS Mismatch:</strong> Legitimate company sites use HTTPS; check for padlock icon</li>
<li><strong>Suspicious Attachments:</strong> .exe, .zip, .scr files or unexpected file types</li>
</ul>

<h3>Context Indicators</h3>
<ul>
<li><strong>Unexpected Timing:</strong> Messages arriving at odd hours or without context</li>
<li><strong>Out-of-Character Requests:</strong> Boss never asks for sensitive info via email</li>
<li><strong>Unsolicited Messages:</strong> From companies you don't work with or use</li>
<li><strong>Personal Information Requests:</strong> Legitimate companies never ask for passwords via email</li>
<li><strong>Too Good to Be True:</strong> Unexpected prizes, winnings, or job offers</li>
</ul>

<h2>What to Do If You Suspect a Phishing Attack</h2>

<h3>Immediate Actions</h3>
<ol>
<li><strong>Don't Click:</strong> Avoid clicking any links or downloading attachments</li>
<li><strong>Don't Reply:</strong> Don't respond to the email directly</li>
<li><strong>Report It:</strong> Use your organization's phishing report button or forward to security@[company].com</li>
<li><strong>Delete:</strong> Remove the email from your inbox after reporting</li>
<li><strong>Screenshot:</strong> Take a screenshot for incident response team records</li>
</ol>

<h3>If You've Already Clicked</h3>
<ol>
<li><strong>Disconnect:</strong> Immediately disconnect from the network (if possible)</li>
<li><strong>Contact IT:</strong> Alert your IT/security team immediately</li>
<li><strong>Change Passwords:</strong> Change passwords for affected accounts from a clean device</li>
<li><strong>Monitor Accounts:</strong> Watch for suspicious activity on financial accounts</li>
<li><strong>Enable Alerts:</strong> Set up fraud alerts with banks and credit card companies</li>
<li><strong>Consider Credit Freeze:</strong> Freeze credit if personal information was compromised</li>
</ol>

<h2>Best Practices for Organizations</h2>

<h3>Leadership and Governance</h3>
<ul>
<li>Make security a board-level priority</li>
<li>Allocate sufficient budget for security infrastructure</li>
<li>Establish clear accountability for security outcomes</li>
<li>Include security in performance evaluations</li>
</ul>

<h3>Continuous Improvement</h3>
<ul>
<li>Conduct quarterly security assessments</li>
<li>Review and update phishing prevention policies annually</li>
<li>Monitor emerging phishing tactics and trends</li>
<li>Share lessons learned across the organization</li>
</ul>

<h3>Cross-Functional Collaboration</h3>
<ul>
<li>Involve HR in awareness training initiatives</li>
<li>Work with Legal/Compliance on incident response procedures</li>
<li>Coordinate with Communications on breach notifications</li>
<li>Partner with external security experts for assessments</li>
</ul>

<h2>Conclusion</h2>

<p>Phishing attacks represent one of the most significant cybersecurity threats facing organizations today. Their low cost and high effectiveness make them a preferred attack vector for cybercriminals targeting everyone from small businesses to Fortune 500 companies.</p>

<p>By implementing a comprehensive, multi-layered defense strategy that combines technical controls, user awareness, organizational policies, and advanced detection capabilities, organizations can significantly reduce their phishing risk and prevent the severe impacts of successful attacks.</p>

<p>Remember: <strong>security is a shared responsibility</strong>. Technical solutions alone are insufficient; a strong security culture where every employee understands their role in defending against phishing is essential.</p>

<p>Stay vigilant, stay informed, and help protect your organization from phishing attacks.</p>

<h2>Key Takeaways</h2>

<ul>
<li>Phishing attacks come in many forms—email, SMS, voice, and sophisticated targeted variants</li>
<li>The impact of successful phishing attacks extends beyond immediate financial loss to reputational and operational damage</li>
<li>A multi-layered defense strategy is essential: technical controls + user awareness + policies + detection</li>
<li>Regular training and simulated phishing campaigns significantly reduce click rates and compromise risk</li>
<li>Reporting mechanisms and quick incident response are critical for limiting damage</li>
<li>Leadership commitment and adequate resource allocation are prerequisites for effective phishing defense</li>
</ul>`;
}

addPhishingPost().catch((err) => { console.error(err); process.exit(1); });
