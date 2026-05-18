import CustomerInformation from '@dropins/storefront-account/containers/CustomerInformation.js';
import { render as accountRenderer } from '@dropins/storefront-account/render.js';
import { CustomerCompanyInfo } from '@dropins/storefront-company-management/containers/CustomerCompanyInfo.js';
import { render as companyRenderer } from '@dropins/storefront-company-management/render.js';
import { companyEnabled } from '@dropins/storefront-company-management/api.js';
import {
  CUSTOMER_LOGIN_PATH,
  checkIsAuthenticated,
  rootLink,
} from '../../scripts/commerce.js';

// Initialize
import '../../scripts/initializers/account.js';
import '../../scripts/initializers/company.js';

export default async function decorate(block) {
  if (!checkIsAuthenticated()) {
    window.location.href = rootLink(CUSTOMER_LOGIN_PATH);
  } else {
    block.innerHTML = '';

    const customerInfoContainer = document.createElement('div');
    customerInfoContainer.classList.add('commerce-customer-information__details');
    block.append(customerInfoContainer);

    await accountRenderer.render(CustomerInformation, {})(customerInfoContainer);

    try {
      if (await companyEnabled()) {
        const customerCompanyContainer = document.createElement('div');
        customerCompanyContainer.classList.add('commerce-customer-information__company');
        block.append(customerCompanyContainer);
        await companyRenderer.render(CustomerCompanyInfo, {})(customerCompanyContainer);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('commerce-customer-information: company summary unavailable', error);
    }
  }
}
