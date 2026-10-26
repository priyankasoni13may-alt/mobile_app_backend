/**
 * Lumora & Cypher Swift — Baseline System Seed Script
 *
 * Seeds strictly core operational infrastructure:
 * 1. RBAC Roles
 * 2. Operating Companies & Business Units
 * 3. Essential Staff Accounts (Admin, Operations, Finance, Sales)
 * 4. Master Partner Agreement
 * 5. Learning Modules & Training Curriculum
 * 6. Official Services Catalogue
 * 7. Commission Policies & Annual Bonus Period
 *
 * NOTE: Zero sample leads, deals, meetings, tasks, notifications, or demo partners
 * are seeded here to ensure no mock or duplicate data exists.
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting clean baseline database seeding (zero sample data)...');

  // 1. System Roles
  const roles = [
    { id: 'role-superadmin', name: 'SUPER_ADMIN', description: 'Complete system access' },
    { id: 'role-operations', name: 'OPERATIONS', description: 'Partner verification, agreements, service delivery' },
    { id: 'role-finance', name: 'FINANCE', description: 'Payment verification, ledger reviews, payout batches' },
    { id: 'role-sales', name: 'SALES', description: 'Lead assignment, discovery meetings, deal closure' },
    { id: 'role-partner', name: 'PARTNER', description: 'Registered business development networking partner' }
  ];

  const roleMap = {};
  for (const r of roles) {
    const roleRecord = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r
    });
    roleMap[r.name] = roleRecord.id;
  }
  console.log('✅ Roles initialized');

  // 2. Companies & Business Units
  const lumoraCompany = await prisma.company.upsert({
    where: { id: 'comp-lumora-01' },
    update: {
      name: 'Lumora Solutions Private Limited',
      legalName: 'Lumora Growth & Marketing Solutions Pvt Ltd'
    },
    create: {
      id: 'comp-lumora-01',
      name: 'Lumora Solutions Private Limited',
      legalName: 'Lumora Growth & Marketing Solutions Pvt Ltd',
      country: 'India'
    }
  });

  const cypherCompany = await prisma.company.upsert({
    where: { id: 'comp-cypher-02' },
    update: {
      name: 'Cypher Swift Technologies Private Limited',
      legalName: 'Cypher Swift Technologies Software Solutions Pvt Ltd'
    },
    create: {
      id: 'comp-cypher-02',
      name: 'Cypher Swift Technologies Private Limited',
      legalName: 'Cypher Swift Technologies Software Solutions Pvt Ltd',
      country: 'India'
    }
  });

  const lumoraBU = await prisma.businessUnit.upsert({
    where: { id: 'bu-lumora-growth' },
    update: {},
    create: {
      id: 'bu-lumora-growth',
      companyId: lumoraCompany.id,
      name: 'Lumora Growth & Marketing',
      brandPrimaryColor: '#7C3AED',
      brandAccentColor: '#4C1D95',
      isActive: true
    }
  });

  const cypherBU = await prisma.businessUnit.upsert({
    where: { id: 'bu-cypher-tech' },
    update: {},
    create: {
      id: 'bu-cypher-tech',
      companyId: cypherCompany.id,
      name: 'Cypher Swift Technology & AI Solutions',
      brandPrimaryColor: '#003566',
      brandAccentColor: '#0B192C',
      isActive: true
    }
  });
  console.log('✅ Companies and Business Units initialized');

  // 3. Essential Staff Accounts Only (No demo partner accounts)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password@123', salt);

  const staffUsers = [
    {
      id: 'user-admin-01',
      fullName: 'Super Administrator',
      email: 'admin@cypherswift.com',
      phone: '+919876543210',
      status: 'ACTIVE',
      role: 'SUPER_ADMIN',
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date()
    },
    {
      id: 'user-ops-02',
      fullName: 'Aarav Patel (Operations)',
      email: 'operations@lumora.com',
      phone: '+919876543211',
      status: 'ACTIVE',
      role: 'OPERATIONS',
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date()
    },
    {
      id: 'user-finance-03',
      fullName: 'Priya Sharma (Finance Head)',
      email: 'finance@cypherswift.com',
      phone: '+919876543212',
      status: 'ACTIVE',
      role: 'FINANCE',
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date()
    },
    {
      id: 'user-sales-04',
      fullName: 'Rohan Verma (Sales Manager)',
      email: 'sales@lumora.com',
      phone: '+919876543213',
      status: 'ACTIVE',
      role: 'SALES',
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date()
    }
  ];

  for (const u of staffUsers) {
    const userRecord = await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash: passwordHash, status: u.status },
      create: {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        passwordHash: passwordHash,
        status: u.status,
        emailVerifiedAt: u.emailVerifiedAt,
        phoneVerifiedAt: u.phoneVerifiedAt
      }
    });

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: userRecord.id, roleId: roleMap[u.role] } },
      update: {},
      create: {
        userId: userRecord.id,
        roleId: roleMap[u.role]
      }
    });

    await prisma.notificationPreference.upsert({
      where: { userId: userRecord.id },
      update: {},
      create: {
        userId: userRecord.id,
        inAppEnabled: true,
        pushEnabled: true,
        emailEnabled: true,
        meetingReminders: true,
        leadUpdates: true,
        policyChanges: true,
        payoutUpdates: true
      }
    });
  }
  console.log('✅ 4 Essential Staff Accounts initialized');

  // 4. Master Agreement
  const masterAgreement = await prisma.agreement.upsert({
    where: { version: '2026.1' },
    update: {},
    create: {
      id: 'agr-2026-v1',
      title: 'Partner Code of Conduct & Commercial Incentive Agreement v2.0',
      version: '2026.1',
      effectiveDate: new Date('2026-01-01'),
      content: `LUMORA & CYPHER SWIFT PARTNER NETWORK AGREEMENT
1. Scope of Relationship: Independent Business Development Partner.
2. Compliance & Anti-Spam: Partners agree to adhere to truthful representation and GDPR/DPDP consent standards.
3. Commercial Terms: Proposed terms, prices, and diagnostic packages are subject to commercial contract.
4. Segregation of Duties: Financial approvals require authorized internal review; partners cannot self-approve payouts.
5. Dispute Resolution: Payout queries and lead disputes are arbitrated via internal review within 7 business days.`,
      isActive: true,
      createdBy: 'user-admin-01'
    }
  });

  // 5. Training Curriculum & Learning Modules
  const modules = [
    {
      id: 'mod-01-compliance',
      businessUnitId: null,
      title: 'Partner Ethics, Compliance & Anti-Spam Guidelines',
      description: 'Understanding truthful outreach, privacy regulations, and code of conduct.',
      contentType: 'ARTICLE',
      content: 'Learn how to approach prospective B2B clients with professionalism, respect privacy, and adhere to DPDP Act regulations.',
      sortOrder: 1,
      isMandatory: true,
      createdBy: 'user-ops-02'
    },
    {
      id: 'mod-02-lumora-pitch',
      businessUnitId: lumoraBU.id,
      title: 'Pitching Lumora Digital Growth & Branding',
      description: 'ICP definition, positioning, key customer pain points, and objections.',
      contentType: 'VIDEO',
      content: 'Master the high-conversion pitch deck for Lumora performance marketing and branding engagements.',
      sortOrder: 2,
      isMandatory: true,
      createdBy: 'user-ops-02'
    },
    {
      id: 'mod-03-cypher-ai',
      businessUnitId: cypherBU.id,
      title: 'Pitching Cypher Swift Custom AI & SaaS Automation',
      description: 'How to qualify mid-market companies needing AI agents and CRM automation.',
      contentType: 'QUIZ',
      content: 'Interactive module covering customer architecture requirements and AI capability qualification.',
      sortOrder: 3,
      isMandatory: true,
      createdBy: 'user-ops-02'
    }
  ];

  for (const m of modules) {
    await prisma.learningModule.upsert({
      where: { id: m.id },
      update: {},
      create: m
    });
  }
  console.log('✅ Agreements and Training Modules initialized');

  // 6. Services Catalogue
  const services = [
    {
      id: 'svc-shared-diag',
      businessUnitId: lumoraBU.id,
      name: 'Shared Business Growth & Technology Diagnostic',
      description: 'Comprehensive 360-degree audit evaluating digital presence, branding, customer acquisition funnel, and core technology infrastructure.',
      icp: 'Mid-sized businesses ($1M - $25M revenue) seeking digital transformation or plateaued growth.',
      deliverablesSummary: 'Comprehensive 40-page diagnostic report with priority action roadmap, tech debt score, and ROI projections.',
      inclusions: ['Digital brand audit', 'Tech stack review', 'Competitor benchmarking', 'Roadmap workshop'],
      exclusions: ['Code rewriting', 'Ad spend management during audit'],
      pitchGuide: 'Position as a low-risk, high-value exploratory evaluation before committing to heavy retainer investments.',
      objectionHandling: { 'We already have an agency': 'The diagnostic provides an unbiased third-party review of agency deliverables and tech bottlenecks.' },
      faqJson: [{ question: 'How long does the audit take?', answer: 'Typically 10-14 business days.' }],
      approvedCaseStudies: [{ title: 'Apex Retail', metric: '3.4x Pipeline Increase', description: 'Identified funnel leakage and CRM integration gaps.' }],
      qualificationQuestions: ['Are you planning marketing or tech investments in the next 6 months?', 'Who signs off on strategic decisions?'],
      priceMinorUnits: BigInt(3700000), // ₹37,000 in paise
      currency: 'INR'
    },
    {
      id: 'svc-lumora-perf',
      businessUnitId: lumoraBU.id,
      name: 'Omnichannel Performance Marketing Retainer',
      description: 'Full-funnel digital demand generation, paid search, social advertising, and conversion rate optimization.',
      icp: 'Direct-to-consumer and high-ticket B2B service companies seeking predictable pipeline.',
      deliverablesSummary: 'Complete multi-channel ad management, weekly creative refreshes, and monthly ROAS reporting.',
      inclusions: ['Google & Meta Ads management', 'Landing page CRO', 'Weekly analytics sync'],
      exclusions: ['Ad spend budget (paid directly to networks)'],
      pitchGuide: 'Target founders who complain about rising customer acquisition costs and low ad returns.',
      objectionHandling: { 'Meta ads are saturated': 'We employ algorithmic creative fatigue avoidance and first-party attribution.' },
      faqJson: [{ question: 'Minimum contract length?', answer: '3 months minimum commitment.' }],
      approvedCaseStudies: [{ title: 'FinFlow Loans', metric: '42% Lower CAC', description: 'Engineered cross-channel lookalike funnels.' }],
      qualificationQuestions: ['What is your current monthly ad spend?', 'What is your customer lifetime value?'],
      priceMinorUnits: BigInt(15000000), // ₹1,50,000 in paise
      currency: 'INR'
    },
    {
      id: 'svc-cypher-ai',
      businessUnitId: cypherBU.id,
      name: 'Autonomous AI Agents & Live Consultant Implementation',
      description: 'Custom autonomous LLM agents integrated with corporate ERP, CRM, and customer support channels.',
      icp: 'Enterprises managing high-volume customer inquiries, logistics tracking, or repetitive document parsing.',
      deliverablesSummary: 'Production-ready AI agent suite deployed in client cloud VPC with enterprise SLAs and vector database.',
      inclusions: ['Custom model fine-tuning / RAG', 'API connectors to HubSpot/Salesforce/SAP', 'Security compliance report'],
      exclusions: ['OpenAI / Anthropic API token costs'],
      pitchGuide: 'Highlight human agent capacity saturation and high resolution latency as primary triggers.',
      objectionHandling: { 'AI hallucinations are risky': 'We enforce strict guardrails, zero hallucination retrieval, and human escalation workflows.' },
      faqJson: [{ question: 'Where is customer data stored?', answer: 'Hosted inside the customer’s private cloud VPC.' }],
      approvedCaseStudies: [{ title: 'LogiX Logistics', metric: '88% First-Contact Resolution', description: 'Autonomous agent handled status queries 24/7.' }],
      qualificationQuestions: ['How many incoming support tickets per day?', 'What CRM or ticketing tools do you run?'],
      priceMinorUnits: BigInt(35000000), // ₹3,50,000 in paise
      currency: 'INR'
    },
    {
      id: 'svc-cypher-custom',
      businessUnitId: cypherBU.id,
      name: 'Modern Web & Cross-Platform Mobile Application Development',
      description: 'End-to-end full-stack software engineering for high-performance React Native mobile and Next.js web applications.',
      icp: 'Funded startups, scaleups, and legacy enterprises replacing outdated desktop software with modern platforms.',
      deliverablesSummary: 'Full source code repository, automated CI/CD pipeline, App Store / Play Store production release, and technical documentation.',
      inclusions: ['Figma design system', 'React Native + Expo mobile client', 'NestJS / PostgreSQL backend API', '90-day post-launch warranty'],
      exclusions: ['Third-party API license fees'],
      pitchGuide: 'Highlight engineering agility, TypeScript end-to-end type safety, and battle-tested architecture.',
      objectionHandling: { 'Should we build in-house?': 'Assembling an in-house team takes 6+ months; we deploy a senior squad in under 14 days.' },
      faqJson: [{ question: 'Do we own the IP?', answer: 'Yes, 100% intellectual property ownership transfers upon payment.' }],
      approvedCaseStudies: [{ title: 'Zenith Health', metric: '4.9 Stars on App Store', description: 'Shipped telemedicine mobile application in 8 weeks.' }],
      qualificationQuestions: ['Do you have functional specifications ready?', 'What is your target launch timeline?'],
      priceMinorUnits: BigInt(50000000), // ₹5,00,000 in paise
      currency: 'INR'
    }
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: {},
      create: s
    });
  }
  console.log('✅ Official Services Catalogue initialized');

  // 7. Commission Policies & Annual Bonus Period
  await prisma.commissionPolicy.upsert({
    where: { policyVersion: 'POL-2026-DIAG' },
    update: {},
    create: {
      id: 'pol-diag-01',
      policyVersion: 'POL-2026-DIAG',
      triggerType: 'DIAGNOSTIC_CLOSURE',
      fixedAmountMinorUnits: BigInt(100000), // ₹1,000 in paise
      percentageBasisPoints: null,
      roundingRule: 'ROUND',
      eligibilityRulesJson: { dealType: 'DIAGNOSTIC', paymentVerified: true },
      effectiveFrom: new Date('2026-01-01'),
      description: 'Diagnostic engagement closure incentive (₹1,000 fixed upon verified payment)',
      createdBy: 'user-admin-01'
    }
  });

  await prisma.commissionPolicy.upsert({
    where: { policyVersion: 'POL-2026-SRVC' },
    update: {},
    create: {
      id: 'pol-srvc-02',
      policyVersion: 'POL-2026-SRVC',
      triggerType: 'SERVICE_MILESTONE',
      fixedAmountMinorUnits: BigInt(1000000), // ₹10,000 in paise
      percentageBasisPoints: 1000, // 10%
      roundingRule: 'ROUND',
      eligibilityRulesJson: { dealType: 'SERVICE', contractSigned: true, paymentVerified: true },
      effectiveFrom: new Date('2026-01-01'),
      description: 'Service contract milestone incentive (₹10,000 standard / 10% contract value)',
      createdBy: 'user-admin-01'
    }
  });

  const bonusPeriod = await prisma.bonusPeriod.upsert({
    where: { periodYear: 2026 },
    update: {},
    create: {
      id: 'bonus-period-2026',
      periodYear: 2026,
      targetEligibleClients: 15,
      bonusAmountMinorUnits: BigInt(10000000), // ₹1,00,000 in paise
      consistencyCriteria: { minDealsPerQuarter: 3 },
      complianceCriteria: { zeroComplianceViolations: true },
      isActive: true,
      createdBy: 'user-admin-01'
    }
  });

  await prisma.commissionPolicy.upsert({
    where: { policyVersion: 'POL-2026-BONUS' },
    update: {},
    create: {
      id: 'pol-bonus-03',
      policyVersion: 'POL-2026-BONUS',
      triggerType: 'ANNUAL_BONUS',
      fixedAmountMinorUnits: BigInt(10000000), // ₹1,00,000 in paise
      roundingRule: 'ROUND',
      eligibilityRulesJson: { bonusPeriodId: bonusPeriod.id, targetClients: 15 },
      effectiveFrom: new Date('2026-01-01'),
      description: 'Annual milestone excellence bonus (₹1,00,000 for 15 closed clients in calendar year)',
      createdBy: 'user-admin-01'
    }
  });
  console.log('✅ Commission Policies and Bonus Period initialized');

  console.log('🎉 Clean baseline database seeding complete! No sample leads, deals, or duplicate data created.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
