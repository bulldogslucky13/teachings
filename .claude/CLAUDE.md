## Project Overview

This project is a sermon and church-based media streaming web application designed for long-form preaching and teaching content. The experience should feel similar to a modern streaming platform (e.g. Netflix) but adapted for church/ministry use—reverent, calm, and content-focused rather than entertainment-driven.

The site emphasizes:
- Video-first content
- Clear typography
- Dark, cinematic visual design
- Simple navigation and discoverability

## General Design Principles
- Use a dark theme with subtle gradients and high contrast text
- Avoid flashy effects; animations should be minimal and purposeful
- Prioritize readability and accessibility
- Layout should feel calm, authoritative, and trustworthy
- UI should scale cleanly from desktop to mobile

## UI
- This repository contains a design system, located in @/app/components/ui. When possible, we should default to using or updating design system components. These components are laid out in @/app/design-system/page.tsx. When a new component is added, always update this page with it's usage.
- You should strive to keep all new components consistent with the existing design system.
- All components of this website should be light and dark mode responsive.
- These design system components should use react-aria under the hood. This should help us keep our components accessible, a necessity for all parts of our application. We have a react-aria mcp server installed to help you with your imeplementation
- When updates are needed to be made to our theme, always try to do these updates at the highest level first, working down to the lower levels (e.g, to add support for light and dark mode colors, we should first attempt to add that to @/app/globals.css, if this is something that can be supported that high up. If not, then an update to a shareable component might be best. If the update is not possible in either case, then update all instances of the individual components. This should be the last option, when avoidable).

## Unit Testing
- Every time a utility function is written or updated, we should write or update unit tests as appropriate. Operate on a red/green pattern with this.