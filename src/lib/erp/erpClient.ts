import { AuthorizedUniversityERPProvider } from './authorizedERPProvider';
import { MockERPProvider } from './mockERPProvider';
import { ERPProvider } from './types';

let erpInstance: ERPProvider | null = null;

export function getERPProvider(): ERPProvider {
  if (!erpInstance) {
    const useMock =
      process.env.USE_MOCK_ERP === 'true' ||
      !process.env.ERP_BASE_URL ||
      process.env.USE_MOCK_ERP === undefined;

    if (useMock) {
      erpInstance = new MockERPProvider();
    } else {
      erpInstance = new AuthorizedUniversityERPProvider();
    }
  }
  return erpInstance;
}

export function resetERPProvider(): void {
  erpInstance = null;
}
