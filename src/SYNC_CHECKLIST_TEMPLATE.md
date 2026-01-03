# ✅ WEB-MOBILE SYNC CHECKLIST TEMPLATE

**Copy this template for every new feature/component/screen**

---

## 📋 FEATURE INFO

**Feature Name:** `_______________________`  
**Type:** [ ] Component [ ] Screen [ ] Feature  
**Date Started:** `_______________________`  
**Developer:** `_______________________`  
**Target Date:** `_______________________`  

---

## 🎯 IMPLEMENTATION CHECKLIST

### Phase 1: Planning & Design

- [ ] Feature designed for **WEB**
- [ ] Feature designed for **MOBILE**
- [ ] Design review completed
- [ ] Props/API defined (consistent across platforms)
- [ ] User flows documented (both platforms)
- [ ] Edge cases identified (both platforms)

**Design Parity:** ___% (Target: 100%)

---

### Phase 2: Web Implementation

- [ ] Component/Screen created: `/src/...`
- [ ] TypeScript types defined
- [ ] Props implemented
- [ ] Styling completed (Tailwind CSS)
- [ ] Responsive design tested
- [ ] Dark mode tested
- [ ] Accessibility checked
- [ ] Error handling added
- [ ] Loading states added
- [ ] i18n (EN/VI) implemented
- [ ] Code reviewed
- [ ] Tests written
- [ ] Documentation written

**Web Status:** [ ] Not Started [ ] In Progress [ ] Complete ✅

---

### Phase 3: Mobile Implementation (MANDATORY - SAME DAY!)

- [ ] Component/Screen created: `/mobile/src/...`
- [ ] TypeScript types defined (match web)
- [ ] Props implemented (match web)
- [ ] Styling completed (React Native)
- [ ] Responsive design tested (iOS/Android)
- [ ] Dark mode tested
- [ ] Accessibility checked
- [ ] Error handling added (match web)
- [ ] Loading states added (match web)
- [ ] i18n (EN/VI) implemented (match web)
- [ ] Code reviewed
- [ ] Tests written
- [ ] Documentation written

**Mobile Status:** [ ] Not Started [ ] In Progress [ ] Complete ✅

---

### Phase 4: Parity Verification

#### Visual Parity
- [ ] Layout identical (accounting for platform differences)
- [ ] Colors/gradients match
- [ ] Typography consistent
- [ ] Spacing/padding same
- [ ] Icons match
- [ ] Animations similar

**Visual Parity:** ___% (Target: 100%)

#### Functional Parity
- [ ] All features work identically
- [ ] Same user flows
- [ ] Same validation rules
- [ ] Same error messages
- [ ] Same success states
- [ ] Same loading states
- [ ] Same placeholder text
- [ ] Same tooltips/hints

**Functional Parity:** ___% (Target: 100%)

#### Code Parity
- [ ] Component props API identical
- [ ] State management consistent
- [ ] Event handlers similar
- [ ] Data structures match
- [ ] TypeScript types aligned
- [ ] Error boundaries similar

**Code Parity:** ___% (Target: 100%)

#### Documentation Parity
- [ ] Web documented with examples
- [ ] Mobile documented with examples
- [ ] Cross-references added (web ↔ mobile)
- [ ] Usage guides complete (both)
- [ ] Edge cases documented (both)
- [ ] Migration guide (if needed)

**Documentation Parity:** ___% (Target: 100%)

---

### Phase 5: Testing

#### Web Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing (if applicable)
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Responsive tested (mobile, tablet, desktop)
- [ ] Dark/Light mode tested
- [ ] Performance tested
- [ ] Accessibility tested

**Web Tests:** [ ] Failing [ ] Passing ✅

#### Mobile Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing (if applicable)
- [ ] iOS tested (simulator + device)
- [ ] Android tested (emulator + device)
- [ ] Different screen sizes tested
- [ ] Dark/Light mode tested
- [ ] Performance tested
- [ ] Accessibility tested

**Mobile Tests:** [ ] Failing [ ] Passing ✅

---

### Phase 6: Documentation

- [ ] Component/Screen documented in code
- [ ] Props documented with JSDoc
- [ ] Examples added to docs
- [ ] README updated (if needed)
- [ ] Storybook/showcase updated (if applicable)
- [ ] Changelog updated
- [ ] Sync status documented

**Documentation:** [ ] Incomplete [ ] Complete ✅

---

### Phase 7: Deployment Readiness

- [ ] Code merged to main (web)
- [ ] Code merged to main (mobile)
- [ ] No merge conflicts
- [ ] CI/CD passing (web)
- [ ] CI/CD passing (mobile)
- [ ] Staging tested (web)
- [ ] Staging tested (mobile)
- [ ] Production ready (web)
- [ ] Production ready (mobile)

**Deployment:** [ ] Not Ready [ ] Ready ✅

---

## 📊 FINAL PARITY SCORE

```
Visual Parity:         ___% / 100%
Functional Parity:     ___% / 100%
Code Parity:           ___% / 100%
Documentation Parity:  ___% / 100%

OVERALL PARITY:        ___% / 100%
```

**✅ REQUIRED: 100% parity before shipping!**

---

## 📝 NOTES & DEVIATIONS

**Platform-Specific Differences (if any):**
```
Web:
- [List any web-specific implementations]

Mobile:
- [List any mobile-specific implementations]

Justification:
- [Explain why differences are necessary]
```

**Known Issues:**
```
- [List any known issues]
- [With workarounds or planned fixes]
```

**Future Improvements:**
```
- [List planned improvements for both platforms]
```

---

## ✅ SIGN-OFF

### Developer
- [ ] I confirm web implementation is complete
- [ ] I confirm mobile implementation is complete
- [ ] I confirm 100% feature parity
- [ ] I confirm all tests passing
- [ ] I confirm documentation complete

**Developer Name:** `_______________________`  
**Date:** `_______________________`  
**Signature:** `_______________________`

---

### Code Reviewer
- [ ] Web code reviewed and approved
- [ ] Mobile code reviewed and approved
- [ ] Parity verified
- [ ] No blocking issues

**Reviewer Name:** `_______________________`  
**Date:** `_______________________`  
**Signature:** `_______________________`

---

### QA
- [ ] Web tested and approved
- [ ] Mobile tested and approved
- [ ] Parity verified
- [ ] No blocking bugs

**QA Name:** `_______________________`  
**Date:** `_______________________`  
**Signature:** `_______________________`

---

## 🚀 DEPLOYMENT STATUS

- [ ] **WEB DEPLOYED:** Date: `_______________________`
- [ ] **MOBILE DEPLOYED:** Date: `_______________________`

**Deployment Notes:**
```
[Add any deployment notes, rollout strategy, etc.]
```

---

## 🎊 COMPLETION

**Status:** [ ] In Progress [ ] Ready to Ship [ ] Shipped ✅

**Web-Mobile Sync:** [ ] Not Synced [ ] Partially Synced [ ] **100% Synced** ✅

---

**✅ This feature is COMPLETE when both platforms ship with 100% parity!**

---

## 📋 QUICK CHECKLIST (Copy-Paste for Quick Status)

```
Feature: [Name]
Status: [In Progress / Complete]

Web:
  - Implementation: [ ] / [✅]
  - Testing: [ ] / [✅]
  - Docs: [ ] / [✅]

Mobile:
  - Implementation: [ ] / [✅]
  - Testing: [ ] / [✅]
  - Docs: [ ] / [✅]

Parity: [___%]
Ready: [ ] / [✅]
```

---

**Remember: Never ship web without mobile, never ship mobile without web!** 🔄
