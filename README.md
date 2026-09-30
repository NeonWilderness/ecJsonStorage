# About ECJsonStorage
 ECJsonStorage is a TS/JS wrapper to the [ExtendsClass JSON Storage API](https://extendsclass.com/json-storage.html) offering of Cyril Bois.

 For API usage, you need a (free) API-Key for which you can apply [here](https://extendsclass.com/create-account-form).

 ECJsonStorage enables you to create, update, patch and delete Bins, which store JSON data. There is a usage limit of
 - 10.000 calls per month
 - Bin size limit of 100kb
 - total account limit of 10mb.

# Installation

- `npm i ecjsonstorage -S` to install the module, which is then both available as CommonJs and ESM version.

- Create an .env file in your project directory root and add the following keys:

  `JSONAPI=your ExtendsClass Api-key`

  `JSONSEC=your self defined Security-key (recommended)`

  The Security-key is used to protect access, modification and deletion of a bin. If a Security-key is passed during create, it will also be required to update, patch and delete this bin.

  The Security-key is also required to request private bins (i.e. bins that were created with `keepPrivate=true`), but not required for public bins.

# Usage

 ## Constructor

 ```
 import { ECJsonStorage } from 'ecjsonstorage';
 import { config } from 'dotenv-safe';
 config();

 const json = new ECJsonStorage(process.env.JSONAPI, process.env.JSONSEC);
 ...
 ```

 ## Create a bin

  `createBin(payload: object, keepPrivate: boolean)`

 ```
  const json = new ECJsonStorage(process.env.JSONAPI, process.env.JSONSEC);
  const payload = { name: 'Neon', profession: 'IT-Consultant' };
  const res = await json.createBin(payload, true);
  console.log(res);
 ```

Further Documentation/Usage details will follow swiftly; for now you may wanna consult the [TS types file](dist/index.d.cts).
