const assert = require('assert');

async function runTests() {
  console.log('🧪 Starting Folio Verification Test Suite...\n');
  const baseUrl = 'http://localhost:3000';

  // 1. Landing Page Test
  console.log('1. Testing Landing Page (/)');
  const resLanding = await fetch(`${baseUrl}/`);
  assert.strictEqual(resLanding.status, 200, 'Landing page should return 200');
  const textLanding = await resLanding.text();
  assert(textLanding.includes('Your work deserves a great first impression.'), 'Landing page must contain headline');
  assert(textLanding.includes('Build your portfolio'), 'Landing page must contain CTA');
  assert(textLanding.includes('Explore templates'), 'Landing page must contain explore templates');
  console.log('   ✅ Landing page rendered successfully with required copy and navigation.\n');

  // 2. Templates Gallery Test
  console.log('2. Testing Template Gallery (/templates)');
  const resTemplates = await fetch(`${baseUrl}/templates`);
  assert.strictEqual(resTemplates.status, 200, 'Templates page should return 200');
  const textTemplates = await resTemplates.text();
  assert(textTemplates.includes('Minimal'), 'Contains Minimal template');
  assert(textTemplates.includes('Studio'), 'Contains Studio template');
  assert(textTemplates.includes('Developer'), 'Contains Developer template');
  console.log('   ✅ Template gallery renders all 3 responsive templates.\n');

  // 3. User Session & Multi-Tenancy
  console.log('3. Testing Multi-User Session (/api/auth/session)');
  const resSession = await fetch(`${baseUrl}/api/auth/session`);
  assert.strictEqual(resSession.status, 200);
  const sessionData = await resSession.json();
  const user1 = sessionData.user;
  console.log(`   User 1: ${user1.name} (${user1.id})`);

  // Switch to User 2 (Sarah Jenkins)
  const resSwitch = await fetch(`${baseUrl}/api/auth/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'user_sarah_jenkins' }),
  });
  const switchedData = await resSwitch.json();
  const user2 = switchedData.user;
  assert.strictEqual(user2.id, 'user_sarah_jenkins', 'Switched user must be Sarah Jenkins');
  console.log(`   User 2: ${user2.name} (${user2.id})`);
  console.log('   ✅ Multi-user switching functions correctly.\n');

  // 4. Create Portfolio for User 2 (Sarah Jenkins)
  console.log('4. Testing Portfolio Creation');
  const cookieUser2 = `folio_user_id=${user2.id}`;
  const resCreate = await fetch(`${baseUrl}/api/portfolios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieUser2,
    },
    body: JSON.stringify({
      template: 'developer',
      title: 'Sarah Jenkins Test Systems',
    }),
  });
  assert.strictEqual(resCreate.status, 201, 'Portfolio creation should return 201');
  const createData = await resCreate.json();
  const newPortfolio = createData.portfolio;
  assert(newPortfolio.id, 'Created portfolio must have an ID');
  assert.strictEqual(newPortfolio.status, 'draft', 'Newly created portfolio must be in draft status');
  console.log(`   ✅ Created portfolio: ${newPortfolio.id} (slug: ${newPortfolio.settings.slug})\n`);

  // 5. Test Slug Availability Check
  console.log('5. Testing Realtime Slug Validation (/api/check-slug)');
  const resSlugTaken = await fetch(`${baseUrl}/api/check-slug?slug=${newPortfolio.settings.slug}`);
  const slugDataTaken = await resSlugTaken.json();
  assert.strictEqual(slugDataTaken.available, false, 'Existing slug should not be available');

  const resSlugAvail = await fetch(`${baseUrl}/api/check-slug?slug=unique-slug-${Date.now()}`);
  const slugDataAvail = await resSlugAvail.json();
  assert.strictEqual(slugDataAvail.available, true, 'Unique slug should be available');
  console.log('   ✅ Slug validation and uniqueness checking verified.\n');

  // 6. Test Private Draft Security (Draft must NOT be exposed publicly)
  console.log('6. Testing Private Draft Protection (public route before publish)');
  const resDraftPublic = await fetch(`${baseUrl}/p/${newPortfolio.settings.slug}`);
  const draftPublicHtml = await resDraftPublic.text();
  assert(draftPublicHtml.includes('Portfolio Not Found or Private'), 'Unpublished draft must not be public');
  console.log('   ✅ Security check passed: private drafts are not exposed through public routes.\n');

  // 7. Update Draft Content (Autosave & Template Preserving)
  console.log('7. Testing Draft Updating & Autosave');
  const updatedContent = JSON.parse(JSON.stringify(newPortfolio.draftData));
  updatedContent.profile.name = 'Sarah Jenkins (Edited)';
  updatedContent.profile.headline = 'Designing resilient edge networks and streaming architectures.';
  updatedContent.projects.push({
    id: `proj_test_${Date.now()}`,
    title: 'Distributed Log Engine',
    summary: 'A high throughput append-only log engine.',
    images: [],
    technologies: ['Rust', 'Raft'],
    role: 'Creator',
  });

  const resUpdate = await fetch(`${baseUrl}/api/portfolios/${newPortfolio.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieUser2,
    },
    body: JSON.stringify({
      draftData: updatedContent,
      settings: newPortfolio.settings,
    }),
  });
  assert.strictEqual(resUpdate.status, 200, 'Update draft should return 200');
  const updateData = await resUpdate.json();
  assert.strictEqual(updateData.portfolio.draftData.profile.name, 'Sarah Jenkins (Edited)');
  console.log('   ✅ Draft content successfully updated and saved.\n');

  // 8. Publish Portfolio Snapshot
  console.log('8. Testing Publishing System');
  const resPublish = await fetch(`${baseUrl}/api/portfolios/${newPortfolio.id}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieUser2,
    },
    body: JSON.stringify({ action: 'publish' }),
  });
  assert.strictEqual(resPublish.status, 200, 'Publishing should return 200');
  const publishData = await resPublish.json();
  assert.strictEqual(publishData.portfolio.status, 'published');
  assert.strictEqual(publishData.portfolio.publishedData.profile.name, 'Sarah Jenkins (Edited)');

  // Verify Public Route now displays the published portfolio!
  const resPublishedPublic = await fetch(`${baseUrl}/p/${publishData.portfolio.publishedSlug}`);
  assert.strictEqual(resPublishedPublic.status, 200);
  const publishedHtml = await resPublishedPublic.text();
  assert(publishedHtml.includes('Sarah Jenkins (Edited)'), 'Public page must contain published name');
  assert(publishedHtml.includes('Distributed Log Engine'), 'Public page must contain published project');
  console.log(`   ✅ Published portfolio is live at /p/${publishData.portfolio.publishedSlug}.\n`);

  // 9. Draft Separation Test: Further edits do NOT change public page until republished!
  console.log('9. Testing Draft Separation (Unpublished edits do not leak to public site)');
  const draftOnlyContent = JSON.parse(JSON.stringify(updatedContent));
  draftOnlyContent.profile.name = 'SECRET DRAFT NAME SHOULD NOT BE PUBLIC';
  await fetch(`${baseUrl}/api/portfolios/${newPortfolio.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieUser2,
    },
    body: JSON.stringify({
      draftData: draftOnlyContent,
      settings: newPortfolio.settings,
    }),
  });

  const resCheckPublicStillOld = await fetch(`${baseUrl}/p/${publishData.portfolio.publishedSlug}`);
  const stillOldHtml = await resCheckPublicStillOld.text();
  assert(stillOldHtml.includes('Sarah Jenkins (Edited)'), 'Public page must still serve published version');
  assert(!stillOldHtml.includes('SECRET DRAFT NAME'), 'Public page must NOT contain un-published draft edits');
  console.log('   ✅ Draft separation verified: Draft edits do not mutate the live site without explicit publish.\n');

  // 10. Multi-Tenant Privacy Isolation Test (User 1 cannot access or mutate User 2's portfolio)
  console.log('10. Testing Multi-Tenant Isolation & Access Control');
  const cookieUser1 = `folio_user_id=user_alex_chen`;
  const resForbiddenGet = await fetch(`${baseUrl}/api/portfolios/${newPortfolio.id}`, {
    headers: { 'Cookie': cookieUser1 },
  });
  assert.strictEqual(resForbiddenGet.status, 404, 'User 1 must not be able to get User 2 private portfolio');

  const resForbiddenDelete = await fetch(`${baseUrl}/api/portfolios/${newPortfolio.id}`, {
    method: 'DELETE',
    headers: { 'Cookie': cookieUser1 },
  });
  assert.strictEqual(resForbiddenDelete.status, 403, 'User 1 must receive 403 Forbidden when deleting User 2 portfolio');
  console.log('   ✅ Multi-tenant isolation verified: User A cannot read or modify User B private portfolio.\n');

  // 11. Duplicate Portfolio
  console.log('11. Testing Portfolio Duplication');
  const resDuplicate = await fetch(`${baseUrl}/api/portfolios/${newPortfolio.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieUser2,
    },
    body: JSON.stringify({ action: 'duplicate' }),
  });
  assert.strictEqual(resDuplicate.status, 201, 'Duplicate should return 201');
  const duplicateData = await resDuplicate.json();
  assert(duplicateData.portfolio.settings.title.includes('(Copy)'), 'Duplicate title should include (Copy)');
  assert.strictEqual(duplicateData.portfolio.status, 'draft', 'Duplicated portfolio must be draft');
  console.log(`   ✅ Duplication created new draft portfolio: ${duplicateData.portfolio.id}\n`);

  // 12. Unpublish Portfolio
  console.log('12. Testing Unpublishing');
  const resUnpublish = await fetch(`${baseUrl}/api/portfolios/${newPortfolio.id}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieUser2,
    },
    body: JSON.stringify({ action: 'unpublish' }),
  });
  assert.strictEqual(resUnpublish.status, 200);
  const unpublishCheck = await fetch(`${baseUrl}/p/${publishData.portfolio.publishedSlug}`);
  const unpublishHtml = await unpublishCheck.text();
  assert(unpublishHtml.includes('Portfolio Not Found or Private'), 'Unpublished portfolio is no longer public');
  console.log('   ✅ Unpublishing verified: portfolio is cleanly taken offline.\n');

  // 13. Delete Duplicate and Test Portfolio
  console.log('13. Testing Portfolio Deletion');
  const resDeleteDup = await fetch(`${baseUrl}/api/portfolios/${duplicateData.portfolio.id}`, {
    method: 'DELETE',
    headers: { 'Cookie': cookieUser2 },
  });
  assert.strictEqual(resDeleteDup.status, 200, 'Delete duplicate should succeed');

  const resDeleteMain = await fetch(`${baseUrl}/api/portfolios/${newPortfolio.id}`, {
    method: 'DELETE',
    headers: { 'Cookie': cookieUser2 },
  });
  assert.strictEqual(resDeleteMain.status, 200, 'Delete main portfolio should succeed');
  console.log('   ✅ Deletion verified.\n');

  console.log('🎉 ALL 13 TEST SUITES PASSED FLAWLESSLY!');
}

runTests().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
