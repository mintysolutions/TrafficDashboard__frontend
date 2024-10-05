/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
    {
        id: 'counts-cam',
        title: 'Counts',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie', // Replaced with chart-pie icon for counts
        link: '/counts-cam',
    },
    {
        id: 'speed-cam',
        title: 'Speed',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie', // Replaced with speedometer icon for speed
        link: '/speed-cam',
    },
    {
        id: 'height-cam',
        title: 'Height',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie', // Replaced with ruler icon for height
        link: '/height-cam',
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'counts-cam',
        title: 'Counts',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/counts-cam',
    },
    {
        id: 'speed-cam',
        title: 'Speed',
        type: 'basic',
        icon: 'heroicons_outline:speedometer',
        link: '/speed-cam',
    },
    {
        id: 'height-cam',
        title: 'Height',
        type: 'basic',
        icon: 'heroicons_outline:ruler',
        link: '/height-cam',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
