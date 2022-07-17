// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

var localStorageMock = (function () {
  var store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
}

global.dummyContract =
  'BiAH6AcBBJmH0wcDAGQmASB6zQMKOJBtxFB4ILNYiiRQngRy5XJoFC96k36qJavhHDIEgQISMwAQIxIQMwEQJBIQQAENMgQhBBIzABAkEhAzARAkEhAzAhAjEhBAAG8yBCEEEjMAECQSEDMBECMSEDMCECMSEEAAAQAzAAEiDjMAIDIDEhAzABMyAxIQMwEBIg4zASAyAxIQEDMAESUSEDMAFCgSEDMAFSgSEDMBBygSEDMBCSgSEDMCACgSEDMCBygSEDMCCCEFEhBCAN4zAAEiDjMAIDIDEhAzABMyAxIQMwAVMgMSEDMBEzIDEhAzABElEhAzABIhBhIQMwERJRIQMwESIQYSEDMAFDMBABIQMwEUKBIQMwIHgCCKaxNJ5pPcb9t1+hmc6CDAgBtvAussZRHPAQiO5V1OjRIQMwIAMwEAEhAzAgiBoMIeEhBCAFozAAEiDjMAIDIDEhAzAAkyAxIQMwEBIg4zASAyAxIQMwETMgMSEDMBFTIDEhAQMwAAKBIQMwAHMwEAEhAzAAiB0OgMDxAzARElEhAzAQAzARQSEDMBEiEFEhBD';
