# Phase 3: Accessibility Requirements (European Accessibility Act Compliance)

**Status:** Pending Implementation
**Deadline:** June 28, 2025 (European Accessibility Act)
**Standard:** WCAG 2.1 Level AA + EN 301 549

---

## Overview

The European Accessibility Act (EAA) requires websites offering services in the EU to meet accessibility standards by June 28, 2025. For Italy, this means compliance with:

- **WCAG 2.1 Level AA** - Web Content Accessibility Guidelines
- **EN 301 549** - European standard for accessibility of ICT products and services
- **Italian Law 4/2004** (Legge Stanca) - Updated to align with EU standards

---

## Required Accessibility Features

### 1. Perceivable Content

#### 1.1 Text Alternatives
- [ ] All images must have meaningful `alt` text
- [ ] Decorative images should have `alt=""`
- [ ] Complex images (charts, infographics) need detailed descriptions
- [ ] Logo images should have appropriate alt text

#### 1.2 Captions and Alternatives for Multimedia
- [ ] Video content must have captions
- [ ] Audio content must have transcripts
- [ ] Pre-recorded video needs audio descriptions (AAA, recommended)

#### 1.3 Adaptable Content
- [ ] Use semantic HTML5 elements (`<main>`, `<nav>`, `<article>`, etc.)
- [ ] Proper heading hierarchy (h1 > h2 > h3, no skipping levels)
- [ ] Content structure independent of visual presentation
- [ ] Landmarks properly defined for screen readers

#### 1.4 Distinguishable Content
- [ ] Color contrast ratio minimum 4.5:1 for normal text
- [ ] Color contrast ratio minimum 3:1 for large text (18pt+ or 14pt+ bold)
- [ ] Color is not the only means of conveying information
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] Images of text avoided (except logos)

### 2. Operable Interface

#### 2.1 Keyboard Accessibility
- [ ] All functionality available via keyboard
- [ ] No keyboard traps (user can navigate away from all elements)
- [ ] Focus visible on all interactive elements
- [ ] Skip links for main content navigation
- [ ] Logical tab order

#### 2.2 Enough Time
- [ ] Users can pause, stop, or hide moving content
- [ ] No time limits on form completion (or ability to extend)
- [ ] Auto-updating content can be paused

#### 2.3 Seizure Prevention
- [ ] No content that flashes more than 3 times per second

#### 2.4 Navigable
- [ ] Page titles descriptive and unique
- [ ] Focus order logical and meaningful
- [ ] Link purpose clear from link text (avoid "click here", "read more")
- [ ] Multiple ways to find pages (navigation, search, sitemap)
- [ ] Headings and labels describe topic or purpose

### 3. Understandable

#### 3.1 Readable
- [ ] Page language declared in HTML (`lang="it"` or `lang="en"`)
- [ ] Language changes marked in content (`lang` attribute on elements)

#### 3.2 Predictable
- [ ] Navigation consistent across pages
- [ ] Components identified consistently
- [ ] No unexpected context changes on focus or input

#### 3.3 Input Assistance
- [ ] Error identification clearly describes the error
- [ ] Form labels and instructions provided
- [ ] Error suggestions provided when possible
- [ ] Error prevention for legal/financial data (review before submit)

### 4. Robust

#### 4.1 Compatible
- [ ] Valid HTML markup
- [ ] Name, role, value defined for custom UI components
- [ ] Status messages announced to screen readers without focus change (ARIA live regions)

---

## Implementation Checklist

### High Priority (Before Launch)

1. **Keyboard Navigation Audit**
   - Test all pages with keyboard only
   - Ensure focus indicators are visible
   - Add skip links to main content
   - Check mobile menu keyboard accessibility

2. **Screen Reader Testing**
   - Test with NVDA (Windows), VoiceOver (Mac/iOS)
   - Verify all content is announced correctly
   - Check form field labels and error messages
   - Verify image alt text

3. **Color Contrast Check**
   - Use automated tools (axe, WAVE)
   - Manually verify custom colors
   - Check text on images and gradients
   - Verify form placeholder text contrast

4. **Form Accessibility**
   - All form fields have visible labels (not just placeholders)
   - Error messages are associated with fields
   - Required fields clearly marked
   - Form validation messages accessible

### Medium Priority (Post-Launch)

5. **Focus Management**
   - Modal dialogs trap focus appropriately
   - Focus returns to trigger element when modal closes
   - Dynamic content updates announced

6. **ARIA Implementation**
   - ARIA landmarks on main sections
   - ARIA labels for icon-only buttons
   - ARIA live regions for dynamic content
   - Custom components have proper ARIA roles

7. **Responsive Accessibility**
   - Content readable at 200% zoom
   - Touch targets minimum 44x44px on mobile
   - Orientation not restricted

### Documentation Required

8. **Accessibility Statement**
   - Create `/accessibility-statement` page
   - List compliance level (WCAG 2.1 AA)
   - Describe known issues and workarounds
   - Provide contact method for accessibility feedback
   - Include date of last review

---

## Testing Tools

### Automated Testing
- **axe DevTools** - Browser extension for WCAG testing
- **WAVE** - Web Accessibility Evaluation Tool
- **Lighthouse** - Chrome DevTools accessibility audit
- **Pa11y** - Command-line accessibility testing

### Manual Testing
- **Keyboard-only navigation** - Tab, Shift+Tab, Enter, Space, Arrows
- **Screen reader testing** - NVDA, VoiceOver, JAWS
- **Zoom testing** - 200% browser zoom
- **Color blindness simulation** - Various filters/tools

### Recommended Audit Process
1. Run automated tools on each page
2. Manually verify flagged issues
3. Perform keyboard-only navigation test
4. Test with screen reader
5. Check color contrast manually for custom colors
6. Test at 200% zoom on mobile and desktop

---

## Code Improvements Needed

### Current Issues to Address

1. **Navigation Component**
   - Add `aria-label="Main navigation"` to nav element
   - Add `aria-current="page"` to current page link
   - Ensure mobile menu has proper focus management

2. **Cookie Consent Banner**
   - Add `role="dialog"` and `aria-modal="true"`
   - Focus should move to banner when it appears
   - Ensure switches have proper accessible names

3. **Image Gallery**
   - Add meaningful alt text to all gallery images
   - Implement keyboard navigation for gallery

4. **Contact Form**
   - Ensure all inputs have proper labels (not just placeholders)
   - Add `aria-describedby` for additional help text
   - Add `aria-invalid` for error states

5. **Dark Mode**
   - Verify contrast ratios in dark mode
   - Ensure focus indicators visible in dark mode

---

## Accessibility Statement Template

Create a page at `/[locale]/accessibility-statement` with the following content:

### Italian Version (Dichiarazione di Accessibilità)

> LAXMI si impegna a garantire l'accessibilità del proprio sito web in conformità con la Direttiva (UE) 2016/2102 e la normativa italiana in materia di accessibilità.
>
> **Stato di conformità:** Questo sito è parzialmente conforme alle WCAG 2.1 livello AA.
>
> **Contenuti non accessibili:** [Elenco delle limitazioni note]
>
> **Feedback e contatti:** Per segnalare problemi di accessibilità o richiedere informazioni in formato alternativo, contattare: thelaxmii07@gmail.com
>
> **Procedura di enforcement:** [Link all'AGID per reclami]
>
> **Data dell'ultima revisione:** [Data]

### English Version (Accessibility Statement)

> LAXMI is committed to ensuring the accessibility of its website in accordance with Directive (EU) 2016/2102 and Italian accessibility legislation.
>
> **Compliance status:** This website is partially compliant with WCAG 2.1 Level AA.
>
> **Non-accessible content:** [List of known limitations]
>
> **Feedback and contact:** To report accessibility issues or request information in an alternative format, contact: thelaxmii07@gmail.com
>
> **Enforcement procedure:** [Link to AGID for complaints]
>
> **Date of last review:** [Date]

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [EN 301 549 Standard](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/)
- [European Accessibility Act](https://ec.europa.eu/social/main.jsp?catId=1202)
- [AGID Italian Accessibility Guidelines](https://www.agid.gov.it/it/design-servizi/accessibilita)
- [WebAIM Accessibility Resources](https://webaim.org/resources/)

---

## Timeline

| Phase | Task | Target Date |
|-------|------|-------------|
| 3.1 | Accessibility audit | February 2025 |
| 3.2 | High-priority fixes | March 2025 |
| 3.3 | Screen reader testing | April 2025 |
| 3.4 | Accessibility statement | May 2025 |
| 3.5 | Final compliance review | June 2025 |
| **Deadline** | **EAA Compliance** | **June 28, 2025** |

---

*This document was created on December 30, 2024, as part of the LAXMI EU Legal Compliance project.*
