# 🔄 WEB-MOBILE SYNC GUIDE - DEVELOPMENT PROTOCOL

**Created:** January 2, 2026  
**Status:** Active Protocol  
**Purpose:** Ensure 100% Feature Parity Between Web & Mobile  

---

## 🎯 CORE PRINCIPLE

> **"Every new component or screen for WEB must be implemented SIMULTANEOUSLY for MOBILE"**

Không làm riêng lẻ. Luôn làm song song để duy trì **100% feature parity**.

---

## 📋 DEVELOPMENT CHECKLIST

### ✅ For Every New Component

When creating a new component for web:

**Step 1: Web Implementation**
```typescript
// ❌ WRONG - Only web
/src/components/NewComponent.tsx

// ✅ CORRECT - Web first
/src/components/NewComponent.tsx
```

**Step 2: Mobile Implementation (MANDATORY)**
```typescript
// ✅ REQUIRED - Immediate mobile version
/mobile/src/components/atoms/NewComponent.tsx
// OR
/mobile/src/components/molecules/NewComponent.tsx
```

**Step 3: Documentation**
```markdown
// ✅ Update both docs
- Web: Component documented
- Mobile: Component documented
- Sync status: ✅ 100%
```

---

### ✅ For Every New Screen

When creating a new screen for web:

**Step 1: Web Implementation**
```typescript
// Web screen
/src/pages/NewScreen.tsx
```

**Step 2: Mobile Implementation (MANDATORY)**
```typescript
// Mobile screen (same day!)
/mobile/src/screens/NewScreen.tsx
```

**Step 3: Navigation Update**
```typescript
// Update both navigation systems
- Web: Add route
- Mobile: Add screen to navigator
```

**Step 4: Sync Verification**
```markdown
✅ Web screen: Complete
✅ Mobile screen: Complete
✅ Feature parity: 100%
✅ Design parity: 100%
✅ Functionality: Identical
```

---

## 🔄 WORKFLOW PROTOCOL

### Standard Development Flow:

```
1. Design Phase
   └─> Design for BOTH web & mobile simultaneously
   
2. Planning Phase
   └─> Estimate work for BOTH platforms
   
3. Implementation Phase (PARALLEL)
   ├─> Web: Implement feature
   └─> Mobile: Implement same feature
   
4. Testing Phase
   ├─> Web: Test thoroughly
   └─> Mobile: Test thoroughly
   
5. Documentation Phase
   ├─> Web: Document
   └─> Mobile: Document
   
6. Deployment Phase
   ├─> Web: Deploy
   └─> Mobile: Deploy (or prepare for app store)
```

**⚠️ NEVER deploy web without mobile ready!**

---

## 📊 SYNC TRACKING SYSTEM

### Component Sync Matrix

| Component Name | Web Status | Mobile Status | Parity % | Notes |
|---------------|------------|---------------|----------|-------|
| Example       | ✅ Done    | ✅ Done       | 100%     | -     |
| NewComponent  | ✅ Done    | ✅ Done       | 100%     | -     |
| FutureComp    | 🔄 WIP     | 🔄 WIP        | 100%     | In progress |

### Screen Sync Matrix

| Screen Name   | Web Status | Mobile Status | Parity % | Notes |
|--------------|------------|---------------|----------|-------|
| Dashboard    | ✅ Done    | ✅ Done       | 100%     | -     |
| NewFeature   | ✅ Done    | ✅ Done       | 100%     | -     |
| FutureScreen | 🔄 WIP     | 🔄 WIP        | 100%     | In progress |

---

## 🎨 DESIGN PARITY RULES

### Rule 1: Identical UI/UX Patterns
```typescript
// Web
<Card variant="elevated" padding="lg">
  <Title>Dashboard</Title>
  <Content />
</Card>

// Mobile - MUST BE SAME
<Card variant="elevated" padding="lg">
  <Title>Dashboard</Title>
  <Content />
</Card>
```

### Rule 2: Shared Component Props
```typescript
// ✅ CORRECT - Same API
interface CardProps {
  variant: 'default' | 'elevated';
  padding: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

// Use SAME props on both platforms
```

### Rule 3: Consistent Naming
```typescript
// ✅ CORRECT
Web:    /src/components/DataTable.tsx
Mobile: /mobile/src/components/molecules/DataTable.tsx

// ❌ WRONG
Web:    /src/components/DataTable.tsx
Mobile: /mobile/src/components/molecules/TableData.tsx
```

---

## 🚀 IMPLEMENTATION STRATEGY

### Strategy 1: Parallel Development

**Best for:** Major features, new screens

```
Week 1:
├─> Day 1-2: Web implementation
├─> Day 3-4: Mobile implementation
└─> Day 5: Testing & sync verification

Result: 100% parity maintained
```

### Strategy 2: Component-First Approach

**Best for:** New component library additions

```
Step 1: Design component API
Step 2: Implement web version
Step 3: Implement mobile version (SAME DAY)
Step 4: Test both
Step 5: Document both
```

### Strategy 3: Feature Bundling

**Best for:** Related features

```
Bundle: User Profile Update
├─> Component: AvatarUpload (web + mobile)
├─> Component: ProfileForm (web + mobile)
├─> Screen: ProfileEdit (web + mobile)
└─> Deploy all together
```

---

## 📝 DOCUMENTATION PROTOCOL

### Every New Component Needs:

**1. Web Documentation**
```typescript
/**
 * NewComponent - Web Version
 * 
 * @description Detailed description
 * @example
 * <NewComponent prop="value" />
 * 
 * @see Mobile version: /mobile/src/components/atoms/NewComponent.tsx
 */
```

**2. Mobile Documentation**
```typescript
/**
 * NewComponent - React Native
 * 
 * @description Same description as web
 * @example
 * <NewComponent prop="value" />
 * 
 * @see Web version: /src/components/NewComponent.tsx
 */
```

**3. Sync Status Document**
```markdown
# NewComponent Sync Status

- [x] Web implementation
- [x] Mobile implementation
- [x] Props API match: 100%
- [x] Visual parity: 100%
- [x] Functionality parity: 100%
- [x] Tests: Both passing
- [x] Documentation: Complete

Status: ✅ SYNCED
```

---

## ⚠️ ANTI-PATTERNS (AVOID!)

### ❌ Pattern 1: Web-Only Development
```
BAD: Build 5 new components for web, plan mobile "later"
GOOD: Build 1 component for web + mobile, then next one
```

### ❌ Pattern 2: Different Component APIs
```typescript
// BAD - Different props
Web:    <Button text="Click" />
Mobile: <Button label="Click" />

// GOOD - Same props
Web:    <Button children="Click" />
Mobile: <Button children="Click" />
```

### ❌ Pattern 3: Deferred Mobile Implementation
```
BAD: "Let's finish web first, mobile in Q2"
GOOD: "Let's build both platforms sprint by sprint"
```

### ❌ Pattern 4: Inconsistent Naming
```
BAD:
  Web: UserDashboard
  Mobile: DashboardUser
  
GOOD:
  Web: UserDashboard
  Mobile: UserDashboard
```

---

## 🎯 PARITY VERIFICATION CHECKLIST

### Before Marking "Complete":

**Visual Parity:**
- [ ] Layout matches across platforms
- [ ] Colors/gradients identical
- [ ] Typography consistent
- [ ] Spacing/padding same
- [ ] Icons match
- [ ] Animations similar (where applicable)

**Functional Parity:**
- [ ] All features work on both
- [ ] Same user flows
- [ ] Same validation rules
- [ ] Same error messages
- [ ] Same success states
- [ ] Same loading states

**Code Parity:**
- [ ] Component props match
- [ ] State management consistent
- [ ] API calls identical
- [ ] Data structures same
- [ ] TypeScript types aligned

**Documentation Parity:**
- [ ] Both platforms documented
- [ ] Examples provided for both
- [ ] Usage guides for both
- [ ] Edge cases covered for both

---

## 📈 CURRENT STATUS

### Components Library
```
Total: 58 components
Web: 58/58 (100%)
Mobile: 58/58 (100%)
Sync: ✅ 100%
```

### Screens
```
Total: 15 screens
Web: 15/15 (100%)
Mobile: 15/15 (100%)
Sync: ✅ 100%
```

### Future Components (Template)
```
Component: [Name]
Web: [ ] Not started / [🔄] WIP / [✅] Done
Mobile: [ ] Not started / [🔄] WIP / [✅] Done
Parity: ___%
```

---

## 🔔 REMINDERS

### Daily Reminders:
- ✅ Working on web? Create mobile version same day
- ✅ New component? Add to BOTH libraries
- ✅ New screen? Implement for BOTH platforms
- ✅ Bug fix? Apply to BOTH codebases

### Weekly Reviews:
- ✅ Check parity matrix
- ✅ Verify sync percentages
- ✅ Update documentation
- ✅ Test both platforms

### Sprint Planning:
- ✅ Estimate for BOTH platforms
- ✅ Design for BOTH platforms
- ✅ Test on BOTH platforms
- ✅ Deploy BOTH together

---

## 🎓 TRAINING GUIDE

### For New Developers:

**Rule #1:**
> "Web and Mobile are twins. What you do for one, you MUST do for the other."

**Rule #2:**
> "Never commit web code without corresponding mobile code ready."

**Rule #3:**
> "100% feature parity is not optional. It's mandatory."

**Rule #4:**
> "When in doubt, check existing components for patterns."

**Rule #5:**
> "Document sync status for every new feature."

---

## 🛠️ TOOLS & AUTOMATION

### Recommended Tools:

**1. Sync Checker Script (Future)**
```bash
npm run check-sync
# Outputs parity percentages
```

**2. Component Generator (Future)**
```bash
npm run generate:component NewComponent
# Creates BOTH web & mobile versions
```

**3. Parity Dashboard (Future)**
```
Visual dashboard showing:
- Components sync: 100%
- Screens sync: 100%
- Props API match: 100%
```

---

## 📞 QUESTIONS?

### Common Questions:

**Q: What if mobile takes longer?**
A: Wait. Don't ship web without mobile. Or adjust scope for both.

**Q: What if platforms need different approaches?**
A: Keep the API same, implementation can differ internally.

**Q: What about platform-specific features?**
A: Clearly mark as "Web-Only" or "Mobile-Only" with justification.

**Q: How to handle responsive differences?**
A: Same components, different layouts. Still 100% feature parity.

---

## 🎯 SUCCESS METRICS

### Target Metrics:

```
Feature Parity: 100% ✅
Component Sync: 100% ✅
Screen Sync: 100% ✅
API Consistency: 100% ✅
Documentation: 100% ✅

Time to Sync: < 1 day ✅
Drift Tolerance: 0% ✅
```

---

## 🔄 UPDATE PROTOCOL

This guide should be updated when:
- [ ] New patterns emerge
- [ ] Tools are added
- [ ] Processes improve
- [ ] Team grows
- [ ] Standards change

---

## 📋 QUICK REFERENCE

### New Component Workflow:
1. Design component (both platforms)
2. Implement web version
3. Implement mobile version (same day!)
4. Test both
5. Document both
6. Verify 100% parity
7. Ship both together

### New Screen Workflow:
1. Design screen (both platforms)
2. Implement web screen
3. Implement mobile screen (same day!)
4. Add navigation (both)
5. Test both
6. Document both
7. Verify 100% parity
8. Ship both together

### Parity Check:
```typescript
✅ Visual: Identical
✅ Functional: Identical
✅ Props API: Identical
✅ Documentation: Complete
✅ Tests: Passing (both)

Status: READY TO SHIP
```

---

## 🎊 COMMITMENT

**We commit to:**
- ✅ 100% feature parity at all times
- ✅ Simultaneous development
- ✅ Consistent user experience
- ✅ Quality across platforms
- ✅ No platform left behind

**Because:**
> "A feature that works on only one platform is not a complete feature."

---

## 📝 CHANGE LOG

### January 2, 2026
- ✅ Created sync guide
- ✅ Established protocols
- ✅ Documented workflows
- ✅ Set standards
- ✅ Current status: 100% parity (15 screens, 22 components)

---

**STATUS: ✅ ACTIVE PROTOCOL**

**COMPLIANCE: MANDATORY**

**GOAL: 100% WEB-MOBILE PARITY FOREVER**

---

**🔄 Remember: Web + Mobile = Complete Feature! 🔄**

**Never ship one without the other!** ✅
