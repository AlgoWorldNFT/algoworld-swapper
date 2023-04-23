// saveSwapConfigurations.test.ts

import axios from 'axios';
import { toast } from 'react-toastify';
import saveSwapConfigurations from './saveSwapConfigurations';

// Mock axios module
jest.mock(`axios`);
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock react-toastify module
jest.mock(`react-toastify`);
const mockedToast = toast as jest.Mocked<typeof toast>;

describe(`saveSwapConfigurations`, () => {
  const mockSwapConfigurations: any[] = [
    {
      id: `1`,
      name: `Swap 1`,
      // ...other SwapConfiguration properties
    },
    {
      id: `2`,
      name: `Swap 2`,
      // ...other SwapConfiguration properties
    },
  ];

  afterEach(() => {
    // Clear mock data after each test
    mockedAxios.post.mockClear();
    mockedToast.error.mockClear();
  });

  it(`should save swap configurations successfully`, async () => {
    const mockResponseData = { success: true };

    // Set axios post response
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponseData });

    const result = await saveSwapConfigurations(mockSwapConfigurations);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `/api/storage/save-configurations`,
      mockSwapConfigurations,
    );
    expect(result).toEqual(mockResponseData);
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it(`should handle error when saving swap configurations`, async () => {
    const error = new Error(`Request failed`);

    // Set axios post error
    mockedAxios.post.mockRejectedValueOnce(error);

    const result = await saveSwapConfigurations(mockSwapConfigurations);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `/api/storage/save-configurations`,
      mockSwapConfigurations,
    );
    expect(result).toBeNull();
    expect(mockedToast.error).toHaveBeenCalledWith(
      `Error saving swap configuration. Please retry.`,
    );
  });
});
