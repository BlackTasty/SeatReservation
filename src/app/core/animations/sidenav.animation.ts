import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/*
 * animation: sideNaveAnimation
 * trigger: 'openClose'
 *
 * comments: sets the width of an element to 300px when 'open' and to 60px
 *   when closed.  Animates in between these two states over '0.3s'
 */
export const sideNavAnimation = trigger('openCloseSidenav', [
  // ...
  state('open', style({
    width: '{{ openWidth }}'
  }),
  { params: { openWidth: '300px' }}
  ),
  state('closed', style({
    width: '69px'
  })),
  transition('open <=> closed', [
    animate('0.3s ease-out')
  ])
]);

/*
 * animation: sideNavContainerAnimation
 * trigger: 'openCloseSidenavContent'
 *
 * comments: Sets the margin-left to 300px when "open" and 69px when "closed".
 */
export const sideNavContainerAnimation = trigger('openCloseSidenavContent', [
  state('open', style({
    'margin-left': '{{ openWidth }}'
  }),
  { params: { openWidth: '300px' }}
  ),
  state('closed', style({
    'margin-left': '69px'
  })),
  transition('open <=> closed', [
    animate('0.3s ease-out')
  ])
]);

export const sideNavShowHideTextAnimation = trigger('showHideSidenavText', [
  state('open', style({
    'opacity': '1.0'
  })),
  state('closed', style({
    'opacity': '0.0'
  })),
  transition('open <=> closed', [
    animate('0.3s ease-out')
  ])
]);

export const sideNavResizeTextAnimation = trigger('resizeSidenavText', [
  state('open', style({
    'width': '100%'
  })),
  state('closed', style({
    'width': '0px'
  })),
  transition('open <=> closed', [
    animate('0.3s ease-out')
  ])
]);

export const sideNavAlignIconsAnimation = trigger('sideNavAlignIcons', [
  state('open', style({
  })),
  state('closed', style({
    'position': 'absolute',
    'left': '8px',
    'right': '8px'
  })),
  transition('open <=> closed', [
    animate('0.3s')
  ])
]);

export const sideNavListPaddingAnimation = trigger('sideNavListPadding', [
  state('open', style({
  })),
  state('closed', style({
    'padding': '0'
  })),
  transition('open <=> closed', [
    animate('0.3s')
  ])
]);

export const sideNavAlignDividerAnimation = trigger('sideNavAlignDivider', [
  state('open', style({
  })),
  state('closed', style({
    'position': 'absolute',
    'left': '8px',
    'right': '8px'
  })),
  transition('open <=> closed', [
    animate('0.3s')
  ])
]);
