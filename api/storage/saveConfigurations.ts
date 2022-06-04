import type { VercelRequest, VercelResponse } from '@vercel/node';

import { File, Web3Storage } from 'web3.storage';

function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  return process.env.AW_WEB_STORAGE_API_KEY as string;

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  // return process.env.WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

const makeFileObjects = (configuration: any) => {
  const buffer = Buffer.from(JSON.stringify(configuration));

  const files = [new File([buffer], `aw_swaps.json`)];
  return files;
};

const saveConfigurations = async (
  request: VercelRequest,
  response: VercelResponse,
) => {
  if (request.method === `POST`) {
    const content = request.body;
    const files = makeFileObjects(content);
    const cid = await makeStorageClient().put(files);
    response.status(200).send(cid);
  } else {
    response.status(500).send(`Request unsupported`);
  }
};

export default saveConfigurations;
