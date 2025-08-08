export const metadata = {
  title: 'Terms of Service – Footsteps Space',
}

export default function TermsPage() {
  const html = `
  <style>
    :root{--txt:#0b0d13;--muted:#4b5563;--bg:#ffffff;--border:#e5e7eb;--link:#0f62fe;}
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,"Helvetica Neue",Arial,"Noto Sans",sans-serif;line-height:1.6;background:var(--bg);color:var(--txt);}
    .container{max-width:900px;margin:0 auto;padding:32px 20px;}
    h1,h2,h3{line-height:1.25;margin:1.2em 0 .6em}
    h1{font-size:2rem}
    h2{font-size:1.35rem;border-top:1px solid var(--border);padding-top:.8rem}
    h3{font-size:1.05rem;color:var(--muted)}
    p,li{font-size:1rem}
    .muted{color:var(--muted)}
    a{color:var(--link);text-decoration:none}
    a:hover{text-decoration:underline}
    .callout{background:#f9fafb;border:1px solid var(--border);border-radius:8px;padding:12px 14px;margin:12px 0}
    .small{font-size:.95rem}
    ul{margin:0 0 1rem 1.25rem}
    .hr{height:1px;background:var(--border);margin:1.2rem 0}
  </style>
  <main class="container">
    <h1>Terms of Service – Footsteps Space</h1>
    <p class="muted">Effective Date: <strong>02 August 2025</strong> &nbsp;|&nbsp; Last Updated: <strong>02 August 2025</strong></p>

    <div class="callout small">
      <strong>Summary (not a substitute for the full Terms):</strong> By using Footsteps Space, you agree to these Terms, our Privacy Policy, and to share only content you have rights to share. Public stories (including locations) can be visible to anyone. Use the app responsibly; we can moderate or remove content that violates these Terms.
    </div>

    <h2 id="1-acceptance">1) Acceptance of Terms</h2>
    <p>By downloading, accessing, or using Footsteps Space (“<strong>Footsteps</strong>”, “<strong>we</strong>”, “<strong>our</strong>”, “<strong>us</strong>”), you agree to these Terms of Service (“<strong>Terms</strong>”) and to our <a href="/privacy">Privacy Policy</a>. If you do not agree, please do not use the Service.</p>

    <h2 id="2-service">2) The Service</h2>
    <p>Footsteps is a location‑based travel storytelling platform that allows users to create, tag, and share travel stories on a map. Features may include user‑generated content (stories, images, videos, and text), location tagging, public or private story settings, discovery, and social interactions. We may add, change, or remove features at any time.</p>

    <h2 id="3-eligibility">3) Eligibility</h2>
    <ul>
      <li>You must be at least 13 years old (or the age of digital consent in your jurisdiction).</li>
      <li>If you are under 18, you must have consent from a parent or legal guardian.</li>
      <li>You must have the legal capacity to enter into these Terms and comply with applicable laws.</li>
    </ul>

    <h2 id="4-account">4) Your Account</h2>
    <ul>
      <li>You are responsible for safeguarding your credentials and for all activity on your account.</li>
      <li>Provide accurate information and keep it updated.</li>
      <li>We may suspend or terminate your account for violations of these Terms, our policies, or applicable law.</li>
    </ul>

    <h2 id="5-content">5) User‑Generated Content and License</h2>
    <p>You retain ownership of content you create or upload (“<strong>User Content</strong>”). By posting or uploading User Content on the Service, you grant Footsteps a worldwide, non‑exclusive, royalty‑free, transferable, and sublicensable license to host, store, reproduce, display, adapt, publish, and distribute such content for the purpose of operating, improving, and promoting the Service. For promotional use outside the Service, we will only use content that is set to “Public.”</p>
    <p><strong>Your responsibilities:</strong> You represent and warrant that you have all necessary rights to the User Content you post and that it does not:</p>
    <ul>
      <li>Infringe any intellectual property, privacy, or publicity rights;</li>
      <li>Contain illegal, defamatory, harassing, hateful, pornographic, or violent material;</li>
      <li>Reveal personal data of others without lawful basis or their consent;</li>
      <li>Contain malware, spam, or deceptive practices.</li>
    </ul>
    <p>We may remove or restrict content that violates these Terms or applicable law, or that we reasonably believe could cause harm to users, third parties, or Footsteps.</p>

    <h2 id="6-location">6) Location Sharing and Safety</h2>
    <ul>
      <li><strong>Public Stories:</strong> If you choose to post a public story with location tags, that location may be visible globally and can be indexed by search engines.</li>
      <li><strong>Private Stories:</strong> Location visibility is limited per your settings.</li>
      <li>You are responsible for your own safety when sharing location data; do not share locations that could compromise your security.</li>
      <li>Location data is processed according to our <a href="/privacy">Privacy Policy</a> and your device permissions.</li>
    </ul>

    <h2 id="7-prohibited">7) Prohibited Uses</h2>
    <ul>
      <li>Illegal activity or violation of any law or regulation;</li>
      <li>Harassment, abuse, discrimination, or harm to others;</li>
      <li>Infringing content or invasion of privacy;</li>
      <li>Automated scraping, bulk data extraction, or use of bots without written consent;</li>
      <li>Reverse engineering, attempting to access non‑public areas, or disrupting the Service;</li>
      <li>Unauthorized advertising, spam, or solicitations.</li>
    </ul>

    <h2 id="8-ip">8) Our Intellectual Property</h2>
    <p>The Footsteps name, logo, product design, code, and all related marks are protected by copyright, trademark, and other laws. You may not use our intellectual property without our prior written consent.</p>

    <h2 id="9-third-party">9) Third‑Party Services</h2>
    <p>The Service may integrate with third‑party services (for example, login providers or analytics). Use of third‑party services is subject to their own terms and policies. We are not responsible for third‑party services.</p>

    <h2 id="10-disclaimers">10) Disclaimers</h2>
    <ul>
      <li>The Service is provided on an “as is” and “as available” basis without warranties of any kind, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non‑infringement.</li>
      <li>We do not warrant that the Service will be uninterrupted, secure, or error‑free, or that content (including locations) is accurate or reliable.</li>
      <li>You assume all risk for your use of the Service and any interactions with others.</li>
    </ul>

    <h2 id="11-liability">11) Limitation of Liability</h2>
    <p>To the maximum extent permitted by law, Footsteps and its founders, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, data, goodwill, or other intangible losses.</p>
    <p>Our total aggregate liability arising out of or relating to the Service shall not exceed <strong>INR 1,000 (Indian Rupees One Thousand)</strong> or the total amount you paid to Footsteps in the twelve (12) months preceding the event giving rise to the claim, whichever is greater.</p>

    <h2 id="12-indemnity">12) Indemnity</h2>
    <p>You agree to indemnify and hold harmless Footsteps, its founders, employees, and affiliates from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or related to: (a) your User Content; (b) your use of the Service; or (c) your violation of these Terms or applicable law.</p>

    <h2 id="13-termination">13) Suspension and Termination</h2>
    <p>We may suspend or terminate your access to the Service at any time, with or without notice, if we reasonably believe you have violated these Terms, our policies, or applicable law, or if your use poses a risk to users, third parties, or Footsteps. You may stop using the Service and delete your account at any time through in‑app settings or by contacting us.</p>

    <h2 id="14-changes">14) Changes to the Service or Terms</h2>
    <p>We may modify the Service or these Terms from time to time. We will post changes here and, for material changes, notify you via email or in‑app notice. Your continued use after changes become effective constitutes acceptance of the updated Terms.</p>

    <h2 id="15-privacy">15) Privacy</h2>
    <p>Your use of the Service is also governed by our <a href="/privacy">Privacy Policy</a>, which explains how we collect, use, store, and share your personal data and your rights under applicable laws, including the DPDP Act (Digital Personal Data Protection Act, 2023 – India), the GDPR (General Data Protection Regulation – European Union), and the CCPA/CPRA (California Consumer Privacy Act / California Privacy Rights Act – United States).</p>

    <h2 id="16-law">16) Governing Law and Jurisdiction</h2>
    <p>These Terms are governed by the laws of India. You agree that courts located in Hyderabad, Telangana, India have exclusive jurisdiction over any dispute arising from or relating to these Terms or the Service.</p>

    <h2 id="17-contact">17) Contact</h2>
    <ul>
      <li><strong>Email (general queries):</strong> <a href="mailto:footsteps.space@gmail.com">footsteps.space@gmail.com</a></li>
      <li><strong>Grievance Officer (required under DPDP Act – Digital Personal Data Protection Act, 2023):</strong><br/>
        Name: Vivek Mankonda<br/>
        Email: <a href="mailto:footsteps.space@gmail.com">footsteps.space@gmail.com</a><br/>
        Response Time: Within 30 days of receipt of your complaint
      </li>
    </ul>

    <div class="hr"></div>
    <p class="small muted">If any provision of these Terms is held unenforceable, the remaining provisions will remain in full force and effect. No waiver is implied by any delay or failure to enforce any provision.</p>
  </main>
  `

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}


