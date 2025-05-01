
import { AdUnit } from './types';

// Define default ad units that will be used for resetting
export const defaultAdUnits: Omit<AdUnit, 'id'>[] = [
  {
    name: 'Top Banner Ad',
    position: 'top',
    code: '<div class="ad-placeholder">Top banner ad placeholder</div>',
    active: true,
    priority: 'high',
  },
  {
    name: 'Middle Content Ad',
    position: 'middle',
    code: '<div class="ad-placeholder">Middle content ad placeholder</div>',
    active: true,
    priority: 'normal',
  },
  {
    name: 'Bottom Footer Ad',
    position: 'bottom',
    code: '<div class="ad-placeholder">Bottom footer ad placeholder</div>',
    active: true,
    priority: 'low',
  },
  {
    name: 'After Timer Ad',
    position: 'after-timer',
    code: '<div class="ad-placeholder">After timer ad placeholder</div>',
    active: true,
    priority: 'high',
  }
];
