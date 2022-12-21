import saveSwapConfigurations from './saveSwapConfigurations';
import axios from 'axios';
import { SwapConfiguration } from '@/models/Swap';

jest.mock(`axios`);

test(`saveSwapConfigurations sends a POST request to the correct URL with the correct data`, async () => {
  const configurations = [{ foo: `bar` }, { baz: `qux` }];
  const expectedUrl = `/api/storage/save-configurations`;

  // Call the function that we are testing
  await saveSwapConfigurations(
    configurations as unknown as SwapConfiguration[],
  );

  // Assert that axios.post was called with the correct arguments
  expect(axios.post).toHaveBeenCalledWith(expectedUrl, configurations);
});
