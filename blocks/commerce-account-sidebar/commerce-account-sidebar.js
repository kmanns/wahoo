import { Icon, provider as UI } from '@dropins/tools/components.js';
import { events } from '@dropins/tools/event-bus.js';
import { rootLink } from '../../scripts/commerce.js';

import '../../scripts/initializers/auth.js';

const ACCOUNT_NAV_ITEMS = [
  {
    title: 'My account',
    description: 'Account details',
    link: '/customer/account',
    icon: 'User',
    permission: 'all',
  },
  {
    title: 'Orders',
    description: 'Track, manage, and return',
    link: '/customer/orders',
    icon: 'Order',
    permission: 'all',
  },
  {
    title: 'Addresses',
    description: 'Manage your locations',
    link: '/customer/address',
    icon: 'AddressBook',
    permission: 'all',
  },
  {
    title: 'Returns',
    description: 'Manage your returns',
    link: '/customer/returns',
    icon: 'EmptyBox',
    permission: 'all',
  },
  {
    title: 'Requisition Lists',
    description: 'Manage your requisition lists',
    link: '/customer/requisition-lists',
    icon: 'List',
    permission: 'all',
  },
  {
    title: 'Company Profile',
    description: 'Manage company',
    link: '/customer/company',
    icon: 'Business',
    permission: 'all',
  },
  {
    title: 'Company Structure',
    description: 'Manage company structure',
    link: '/customer/company/structure',
    icon: 'Structure',
    permission: 'all',
  },
  {
    title: 'Company Users',
    description: 'Manage company users',
    link: '/customer/company/users',
    icon: 'Team',
    permission: 'all',
  },
  {
    title: 'Roles and Permissions',
    description: 'Manage roles and permissions',
    link: '/customer/company/roles',
    icon: 'Locker',
    permission: 'Magento_Company::roles_view',
  },
  {
    title: 'Company Credit',
    description: 'View company credit history',
    link: '/customer/company/credit',
    icon: 'Wallet',
    permission: 'all',
  },
  {
    title: 'Quotes',
    description: 'Manage negotiable quotes',
    link: '/customer/negotiable-quote',
    icon: 'Quote',
    permission: 'all',
  },
  {
    title: 'Quote Templates',
    description: 'Manage negotiable quote templates',
    link: '/customer/negotiable-quote-template',
    icon: 'Bulk',
    permission: 'all',
  },
  {
    title: 'Purchase Orders',
    description: 'Manage purchase orders',
    link: '/customer/purchase-orders',
    icon: 'Purchase',
    permission: 'Magento_PurchaseOrder::view_purchase_orders',
  },
  {
    title: 'Approval Rules',
    description: 'Manage approval rules',
    link: '/customer/approval-rules',
    icon: 'CheckWithCircle',
    permission: 'Magento_PurchaseOrderRule::view_approval_rules',
  },
];

const isAllowed = (permissions, permission) => {
  const { admin } = permissions;

  if (permission === 'all') return true;
  if (admin === true) return true;
  if (permissions[permission] === false) return false;
  return Boolean(permissions[permission]);
};

const isActiveLink = (link) => {
  const { pathname } = new URL(rootLink(link), window.location.origin);
  return pathname === window.location.pathname;
};

const createMenuItemIcon = (iconSource) => {
  const iconEl = document.createElement('span');
  iconEl.classList.add('commerce-account-sidebar__item-icon');
  UI.render(Icon, { source: iconSource, size: 24 })(iconEl);
  return iconEl;
};

const createMenuItemArrow = () => {
  const arrowEl = document.createElement('span');
  arrowEl.classList.add('commerce-account-sidebar__item-chevron');
  return arrowEl;
};

const createMenuItemContent = (title, description) => {
  const contentEl = document.createElement('span');
  contentEl.classList.add('commerce-account-sidebar__item-copy');

  const titleEl = document.createElement('span');
  titleEl.classList.add('commerce-account-sidebar__item-title');
  titleEl.textContent = title;

  const descriptionEl = document.createElement('span');
  descriptionEl.classList.add('commerce-account-sidebar__item-description');
  descriptionEl.textContent = description;

  contentEl.append(titleEl, descriptionEl);
  return contentEl;
};

export default async function decorate(block) {
  const populateNav = (permissions = { all: true }) => {
    block.innerHTML = '';

    ACCOUNT_NAV_ITEMS
      .filter((item) => isAllowed(permissions, item.permission))
      .forEach((item) => {
        const menuItemEl = document.createElement('a');
        menuItemEl.classList.add('commerce-account-sidebar__item');
        if (isActiveLink(item.link)) {
          menuItemEl.classList.add('commerce-account-sidebar__item--active');
        }
        menuItemEl.href = rootLink(item.link);

        menuItemEl.append(
          createMenuItemIcon(item.icon),
          createMenuItemContent(item.title, item.description),
          createMenuItemArrow(),
        );

        block.append(menuItemEl);
      });
  };

  events.on('auth/permissions', populateNav, { eager: true });
  populateNav();

  setTimeout(async () => {
    if (block.children.length > 1) return;

    try {
      const authenticated = events.lastPayload('authenticated');
      if (!authenticated) return;

      const { getCustomerRolePermissions } = await import('@dropins/storefront-auth/api.js');
      const permissions = await getCustomerRolePermissions();
      populateNav(permissions);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('commerce-account-sidebar: fallback permissions fetch failed', error);
    }
  }, 100);
}
