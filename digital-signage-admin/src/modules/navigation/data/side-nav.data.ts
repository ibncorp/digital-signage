import { SideNavItems, SideNavSection } from '@modules/navigation/models';

export const sideNavSections: SideNavSection[] = [
    {
        text: 'CORE',
        items: ['dashboard'],
    },
    {
        text: 'MASTER DATA',
        items: ['outlets', 'devices', 'media'],
    },
    {
        text: 'CONTENT MANAGEMENT',
        items: ['menu', 'promo', 'video'],
    },
];

export const sideNavItems: SideNavItems = {
    dashboard: {
        icon: 'tachometer-alt',
        text: 'Dashboard',
        link: '/dashboard',
    },
    devices: {
        icon: 'microchip',
        text: 'Devices',
        link: '/devices',
    },
    outlets: {
        icon: 'store',
        text: 'Outlets',
        link: '/outlets',
    },
    menu: {
        icon: 'list',
        text: 'Menu',
        link: '/content-menu',
    },
    promo: {
        icon: 'bullhorn',
        text: 'Promo',
        link: '/content-promo',
    },
    video: {
        icon: 'film',
        text: 'Video',
        link: '/content-video',
    },
    media: {
        icon: 'photo-video',
        text: 'Media',
        submenu: [
            {
                text: 'Pictures',
                link: '/media/pictures',
            },
            {
                text: 'Videos',
                link: '/media/videos'
            },
        ],
    },
};
