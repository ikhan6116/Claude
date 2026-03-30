#!/usr/bin/env node

/**
 * Blog Content Generation Script
 *
 * This script provides a content calendar and templates for generating
 * 2-3 SEO-optimized blog posts per week for the debt relief niche.
 *
 * Usage: node scripts/generate-blogs.js [week-number]
 *
 * Each blog post targets specific long-tail, low-competition keywords
 * in the debt consolidation/relief space.
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'content', 'blog');

// Content calendar: 12 weeks of topics (2-3 posts per week)
// Each topic targets high-intent, low-competition long-tail keywords
const CONTENT_CALENDAR = [
  // Week 1
  {
    week: 1,
    posts: [
      {
        slug: 'how-to-get-out-of-credit-card-debt-without-bankruptcy',
        title: 'How to Get Out of Credit Card Debt Without Filing for Bankruptcy',
        category: 'Credit Card Debt',
        keywords: ['how to get out of credit card debt without bankruptcy', 'credit card debt relief options', 'alternatives to bankruptcy for credit card debt'],
        status: 'published',
      },
      {
        slug: 'debt-consolidation-loans-for-bad-credit-what-you-need-to-know',
        title: 'Debt Consolidation Loans for Bad Credit: What You Need to Know in 2026',
        category: 'Debt Consolidation',
        keywords: ['debt consolidation loans for bad credit', 'consolidation loan with low credit score', 'debt consolidation options bad credit'],
        status: 'published',
      },
      {
        slug: 'medical-bills-going-to-collections-what-to-do',
        title: "Medical Bills Going to Collections? Here's Exactly What to Do",
        category: 'Medical Debt',
        keywords: ['medical bills going to collections what to do', 'how to deal with medical debt in collections', 'negotiate medical bills in collections'],
        status: 'published',
      },
    ],
  },
  // Week 2
  {
    week: 2,
    posts: [
      {
        slug: 'debt-settlement-vs-debt-consolidation-which-is-right-for-you',
        title: 'Debt Settlement vs Debt Consolidation: Which Is Right for You?',
        category: 'Debt Relief',
        keywords: ['debt settlement vs debt consolidation', 'difference between debt settlement and consolidation', 'should I settle or consolidate my debt'],
      },
      {
        slug: 'can-you-negotiate-credit-card-debt-after-charge-off',
        title: 'Can You Negotiate Credit Card Debt After a Charge-Off?',
        category: 'Credit Card Debt',
        keywords: ['negotiate credit card debt after charge off', 'how to settle charged off credit card debt', 'credit card charge off negotiation'],
      },
      {
        slug: 'how-much-debt-do-you-need-to-qualify-for-debt-relief',
        title: 'How Much Debt Do You Need to Qualify for Debt Relief Programs?',
        category: 'Debt Relief',
        keywords: ['minimum debt for debt relief program', 'how much debt to qualify for debt settlement', 'debt relief program requirements'],
      },
    ],
  },
  // Week 3
  {
    week: 3,
    posts: [
      {
        slug: 'what-happens-if-you-stop-paying-credit-cards',
        title: 'What Happens If You Stop Paying Your Credit Cards? A Timeline',
        category: 'Credit Card Debt',
        keywords: ['what happens if you stop paying credit cards', 'stopped paying credit card debt', 'consequences of not paying credit cards'],
      },
      {
        slug: 'how-to-negotiate-medical-bills-after-insurance',
        title: 'How to Negotiate Medical Bills After Insurance Has Paid',
        category: 'Medical Debt',
        keywords: ['how to negotiate medical bills after insurance', 'reduce medical bills after insurance payment', 'negotiate hospital bill after insurance'],
      },
    ],
  },
  // Week 4
  {
    week: 4,
    posts: [
      {
        slug: 'debt-relief-programs-that-are-not-scams',
        title: 'Legitimate Debt Relief Programs: How to Avoid Scams in 2026',
        category: 'Debt Relief',
        keywords: ['legitimate debt relief programs', 'debt relief programs that are not scams', 'how to tell if debt relief company is legit'],
      },
      {
        slug: 'how-to-get-out-of-50000-in-credit-card-debt',
        title: 'How to Get Out of $50,000 in Credit Card Debt: A Realistic Plan',
        category: 'Credit Card Debt',
        keywords: ['how to get out of 50000 in credit card debt', 'paying off 50k credit card debt', 'debt relief for 50000 credit card debt'],
      },
      {
        slug: 'does-debt-consolidation-hurt-your-credit-score',
        title: 'Does Debt Consolidation Hurt Your Credit Score? The Truth',
        category: 'Debt Consolidation',
        keywords: ['does debt consolidation hurt your credit score', 'debt consolidation credit score impact', 'will consolidating debt lower my credit'],
      },
    ],
  },
  // Week 5
  {
    week: 5,
    posts: [
      {
        slug: 'how-to-deal-with-debt-collectors-calling-about-old-debt',
        title: 'How to Deal With Debt Collectors Calling About Old Debt',
        category: 'Debt Relief',
        keywords: ['debt collectors calling about old debt', 'how to deal with debt collectors', 'old debt collection calls rights'],
      },
      {
        slug: 'best-way-to-pay-off-multiple-credit-cards-at-once',
        title: 'Best Way to Pay Off Multiple Credit Cards at Once',
        category: 'Credit Card Debt',
        keywords: ['best way to pay off multiple credit cards', 'pay off multiple credit cards at once', 'strategy for paying off several credit cards'],
      },
    ],
  },
  // Week 6
  {
    week: 6,
    posts: [
      {
        slug: 'can-medical-debt-be-forgiven-or-written-off',
        title: 'Can Medical Debt Be Forgiven or Written Off? Your Options',
        category: 'Medical Debt',
        keywords: ['can medical debt be forgiven', 'medical debt write off', 'hospital bill forgiveness programs', 'medical debt charity care'],
      },
      {
        slug: 'debt-consolidation-without-taking-out-a-loan',
        title: 'How to Consolidate Debt Without Taking Out a Loan',
        category: 'Debt Consolidation',
        keywords: ['consolidate debt without a loan', 'debt consolidation without borrowing', 'no loan debt consolidation options'],
      },
      {
        slug: 'what-is-the-average-debt-settlement-percentage',
        title: 'What Is the Average Debt Settlement Percentage? Real Numbers',
        category: 'Debt Relief',
        keywords: ['average debt settlement percentage', 'how much can debt be settled for', 'typical debt settlement amount'],
      },
    ],
  },
  // Week 7
  {
    week: 7,
    posts: [
      {
        slug: 'how-to-rebuild-credit-after-debt-settlement',
        title: 'How to Rebuild Your Credit After Debt Settlement',
        category: 'Debt Relief',
        keywords: ['rebuild credit after debt settlement', 'credit score after debt settlement', 'how long to recover credit after settlement'],
      },
      {
        slug: 'is-debt-consolidation-worth-it-for-credit-card-debt',
        title: 'Is Debt Consolidation Worth It for Credit Card Debt?',
        category: 'Debt Consolidation',
        keywords: ['is debt consolidation worth it', 'debt consolidation worth it credit cards', 'pros and cons of debt consolidation'],
      },
    ],
  },
  // Week 8
  {
    week: 8,
    posts: [
      {
        slug: 'how-to-stop-wage-garnishment-for-credit-card-debt',
        title: 'How to Stop Wage Garnishment for Credit Card Debt',
        category: 'Credit Card Debt',
        keywords: ['stop wage garnishment credit card debt', 'how to stop garnishment for credit cards', 'wage garnishment credit card help'],
      },
      {
        slug: 'debt-relief-options-for-senior-citizens-on-fixed-income',
        title: 'Debt Relief Options for Senior Citizens on a Fixed Income',
        category: 'Debt Relief',
        keywords: ['debt relief for senior citizens', 'debt help for seniors on fixed income', 'senior citizen debt relief programs'],
      },
      {
        slug: 'how-to-get-out-of-debt-on-a-low-income',
        title: 'How to Get Out of Debt on a Low Income: Practical Steps',
        category: 'Debt Relief',
        keywords: ['how to get out of debt on low income', 'debt relief low income', 'paying off debt with low salary'],
      },
    ],
  },
  // Week 9-12 continue the pattern...
  {
    week: 9,
    posts: [
      {
        slug: 'what-debts-can-be-included-in-debt-consolidation',
        title: 'What Types of Debt Can Be Included in Debt Consolidation?',
        category: 'Debt Consolidation',
        keywords: ['what debts can be consolidated', 'types of debt for consolidation', 'which debts qualify for consolidation'],
      },
      {
        slug: 'how-to-deal-with-overwhelming-debt-and-anxiety',
        title: 'How to Deal With Overwhelming Debt and Financial Anxiety',
        category: 'Debt Relief',
        keywords: ['overwhelming debt anxiety', 'stress from debt', 'how to cope with debt stress', 'financial anxiety help'],
      },
    ],
  },
  {
    week: 10,
    posts: [
      {
        slug: 'debt-settlement-tax-implications-what-you-owe-the-irs',
        title: 'Debt Settlement Tax Implications: What You Might Owe the IRS',
        category: 'Debt Relief',
        keywords: ['debt settlement tax implications', 'do you pay taxes on settled debt', 'irs debt settlement tax'],
      },
      {
        slug: 'personal-loan-to-pay-off-credit-card-debt-good-idea',
        title: 'Using a Personal Loan to Pay Off Credit Card Debt: Good Idea?',
        category: 'Credit Card Debt',
        keywords: ['personal loan to pay off credit card debt', 'should I take a loan to pay credit cards', 'personal loan vs credit card debt'],
      },
    ],
  },
  {
    week: 11,
    posts: [
      {
        slug: 'how-long-does-debt-consolidation-take-to-complete',
        title: 'How Long Does Debt Consolidation Take? Realistic Timelines',
        category: 'Debt Consolidation',
        keywords: ['how long does debt consolidation take', 'debt consolidation timeline', 'how long to pay off consolidated debt'],
      },
      {
        slug: 'can-you-get-a-mortgage-after-debt-settlement',
        title: 'Can You Get a Mortgage After Debt Settlement?',
        category: 'Debt Relief',
        keywords: ['mortgage after debt settlement', 'buy a house after settling debt', 'home loan after debt settlement'],
      },
      {
        slug: 'emergency-room-bills-without-insurance-how-to-negotiate',
        title: 'Emergency Room Bills Without Insurance: How to Negotiate',
        category: 'Medical Debt',
        keywords: ['emergency room bill without insurance', 'negotiate er bill no insurance', 'reduce emergency room bill'],
      },
    ],
  },
  {
    week: 12,
    posts: [
      {
        slug: 'debt-snowball-vs-debt-avalanche-which-works-better',
        title: 'Debt Snowball vs Debt Avalanche: Which Method Works Better?',
        category: 'Debt Relief',
        keywords: ['debt snowball vs avalanche', 'which debt payoff method is best', 'snowball method vs avalanche method'],
      },
      {
        slug: 'how-to-consolidate-credit-card-debt-with-high-interest',
        title: 'How to Consolidate Credit Card Debt With High Interest Rates',
        category: 'Debt Consolidation',
        keywords: ['consolidate high interest credit card debt', 'how to lower credit card interest', 'high interest credit card consolidation'],
      },
    ],
  },
];

function generateBlogTemplate(post) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  return `---
title: "${post.title}"
description: "TODO: Write a compelling 150-160 character meta description targeting: ${post.keywords[0]}"
date: "${dateStr}"
author: "Freedom Debt Solutions Team"
category: "${post.category}"
tags: [${post.keywords.slice(0, 3).map(k => `"${k.split(' ').slice(0, 3).join(' ')}"`).join(', ')}]
keywords: [${post.keywords.map(k => `"${k}"`).join(', ')}]
---

# ${post.title}

<!--
TARGET KEYWORDS: ${post.keywords.join(', ')}
WORD COUNT TARGET: 1500-2500 words
INCLUDE: Statistics, actionable advice, clear headings with keywords
CTA: Include 2-3 calls to action throughout the article
-->

TODO: Write comprehensive, SEO-optimized content for this topic.

## Key Points to Cover

${post.keywords.map((k, i) => `${i + 1}. Address the search intent behind "${k}"`).join('\n')}

## Content Guidelines

- Open with a hook that addresses the reader's pain point
- Use H2 and H3 headings that include target keywords naturally
- Include actionable steps, tips, or a how-to format
- Add statistics and data points to build authority
- Include internal links to service pages (/debt-consolidation, /debt-relief, /credit-card-debt-help, /medical-debt-relief)
- End with a strong CTA directing readers to /get-started

**Ready to take the first step?** Our certified debt specialists offer free, no-obligation consultations. Get your personalized debt relief plan today.
`;
}

function main() {
  const weekArg = process.argv[2];

  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  if (weekArg === 'calendar') {
    console.log('\n📅 CONTENT CALENDAR - 12 Week Plan\n');
    console.log('='.repeat(60));
    CONTENT_CALENDAR.forEach(week => {
      console.log(`\nWeek ${week.week} (${week.posts.length} posts):`);
      week.posts.forEach(post => {
        const status = post.status === 'published' ? '[PUBLISHED]' : '[PENDING]';
        console.log(`  ${status} ${post.title}`);
        console.log(`    Keywords: ${post.keywords[0]}`);
      });
    });
    console.log('\n' + '='.repeat(60));
    console.log(`Total posts planned: ${CONTENT_CALENDAR.reduce((sum, w) => sum + w.posts.length, 0)}`);
    return;
  }

  if (weekArg) {
    const weekNum = parseInt(weekArg, 10);
    const week = CONTENT_CALENDAR.find(w => w.week === weekNum);

    if (!week) {
      console.error(`Week ${weekNum} not found in content calendar.`);
      process.exit(1);
    }

    console.log(`\nGenerating templates for Week ${weekNum}...\n`);
    week.posts.forEach(post => {
      if (post.status === 'published') {
        console.log(`  SKIP: ${post.slug} (already published)`);
        return;
      }

      const filePath = path.join(BLOG_DIR, `${post.slug}.md`);
      if (fs.existsSync(filePath)) {
        console.log(`  SKIP: ${post.slug} (file exists)`);
        return;
      }

      const content = generateBlogTemplate(post);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  CREATED: ${post.slug}.md`);
    });
  } else {
    console.log('\nUsage:');
    console.log('  node scripts/generate-blogs.js calendar    - View content calendar');
    console.log('  node scripts/generate-blogs.js <week>      - Generate templates for a week');
    console.log('\nExample: node scripts/generate-blogs.js 2');
  }
}

main();
