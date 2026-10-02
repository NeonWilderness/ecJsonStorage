# About ECJsonStorage
 ECJsonStorage is a TS/JS wrapper to the [ExtendsClass JSON Storage API](https://extendsclass.com/json-storage.html) offering of Cyril Bois.

 For API usage, you need a (free) API-Key for which you can apply on the [ExtendsClass site](https://extendsclass.com/create-account-form).

 ECJsonStorage enables you to create, update, patch and delete "Bins" to store JSON data. There is a usage limit of
 - 10.000 calls per month
 - Bin size limit of 100kb
 - total account limit of 10mb.

# Installation

- `npm i @neonwilderness/ecjsonstorage -S` to install the package (available as CommonJs and ESM).

- Copy the `.env.template` to your project folder and create a related `.env` file by adding at least the following keys:

  `JSONAPI=your ExtendsClass Api-key`

  `JSONSEC=your self defined Security-key (recommended)`

  The Security-key is used to protect access, modification and deletion of a bin. If a Security-key is passed during create, it will also be required to update, patch and delete this bin.

  The Security-key is also required to request private bins (i.e. bins that were created with `keepPrivate=true`), but not required for public bins.

# Usage

## Constructor

### constructor(apiKey: string, securityKey?: string, url?: string)

```
import { ECJsonStorage } from '@neonwilderness/ecjsonstorage';
import { config } from 'dotenv-safe';
config();

const json = new ECJsonStorage(process.env.JSONAPI, process.env.JSONSEC);
...
```

> Param `url` will only be needed once the main API address changes. To protect your bins from unauthorized access, you should use a Security-key and pass it as the second parameter.

## Create a new bin

### createBin(payload: object, keepPrivate: boolean): Promise<resCreateBin | resError>

Param | Type | Text
--- | --- | ---
payload | object | JSON object
keepPrivate | boolean | TRUE=Bin is kept private | Security-key needed for access

resCreateBin Property | Type | Text
--- | --- | --- 
status | string | 'ok'
uri | string | full URI of the created bin
bin | string | bin ID

<u>or</u>

resError Property | Type | Text
--- | --- | --- 
status | string | 'error'
statusText | string | error text

> If an error occurs, the returned object is always `<resError>`.

> Best practice is to always check `res.status` first. If it's not 'ok' (lowercase), then the class function did not run successfully.

```
const json = new ECJsonStorage(process.env.JSONAPI, process.env.JSONSEC);
const payload = { name: 'Neon', profession: 'IT-Consultant' };
const res = await json.createBin(payload, true);
console.log(res);
```

## Get all bin IDs

### getBins(): Promise<resGetBins | resError>

This function returns all bins that have been created (and still exist) for the given Api-key. It also returns the current quota limit, i.e. number of calls made and number of ramaining calls (Limit is 10.000 calls per month).

resGetBins Property | Type | Text
--- | --- | --- 
status | string | 'ok'
callsDone | number | number of API calls made this month
callsRemaining | number | number of API calls remaining before the limit kicks in
bins | string[] | array of strings (bin ID)

```
const json = new ECJsonStorage(process.env.JSONAPI, process.env.JSONSEC);
const res = await json.getBins();
console.log(`I have ${res.bins.length} bins and the IDs are: ${res.bins}`);
```

## Get statistics (Quota limit)

### getStats(): Promise<resGetStats | resError>

This function is a syntactic sugar function for getBins and only returns the current quota limit, i.e. number of calls made and number of ramaining calls.

resGetStats Property | Type | Text
--- | --- | --- 
status | string | 'ok'
callsDone | number | number of API calls made this month
callsRemaining | number | number of API calls remaining before the limit kicks in

```
const json = new ECJsonStorage(process.env.JSONAPI, process.env.JSONSEC);
const res = await json.getStats();
console.log(`Used calls: ${res.callsDone}, calls remaining: ${res.callsRemaining}`);
```

## Get a bin's content

### getBin(bin: string): Promise<resGetBin | resError>

This function reads the bin and returns its content.

Param | Type | Text
--- | --- | ---
bin | string | Bin ID to read

resGetBin Property | Type | Text
--- | --- | --- 
status | string | 'ok'
data | object | JSON object (Content of bin)

```
const json = new ECJsonStorage(process.env.JSONAPI, process.env.JSONSEC);
const res = await json.getBin('c8ba8b1da99c');
console.log(res.data);
```

## Update a bin

### updateBin(payload: object, bin: string): Promise<resUpdateBin | resError>

Param | Type | Text
--- | --- | ---
payload | object | JSON object
bin | string | Bin ID to be updated

resUpdateBin Property | Type | Text
--- | --- | --- 
status | string | 'ok'
data | string | Stringified JSON object (Content of updated bin)

```
const json = new ECJsonStorage(process.env.JSONAPI, process.env.JSONSEC);
const newPayload = { name: 'Wilderness', profession: 'Web Ninja' };
const res = await json.updateBin(newPayload, 'c8ba8b1da99c');
console.log(res);
```

## Patch a bin

### patchBin(payload: object, bin: string): Promise<resPatchBin | resError>

Param | Type | Text
--- | --- | ---
payload | object | JSON object
bin | string | Bin ID to be patched

resUpdateBin Property | Type | Text
--- | --- | --- 
status | string | 'ok'
data | string | Stringified JSON object (Content of patched bin)

```
const json = new ECJsonStorage(process.env.JSONAPI, process.env.JSONSEC);
//current bin = { name: 'Wilderness', profession: 'Web Ninja' }
const addPayload = { song: 'In a NeonWilderness he was restless', state: 'Germany' };
const res = await json.patchBin(addPayload, 'c8ba8b1da99c');
console.log(res);
//patched bin = { name: 'Wilderness', profession: 'Web Ninja', song: 'In a NeonWilderness he was restless', state: 'Germany' }
```

> For more information regarding PATCH, please refer to the [ExtendsClass site - "Partially update JSON"](https://extendsclass.com/json-storage.html#apiDocumentation).

## Delete a bin

### deleteBin(bin: string): Promise<resDeleteBin | resError>

Param | Type | Text
--- | --- | ---
bin | string | Bin ID to be deleted

resDeleteBin Property | Type | Text
--- | --- | --- 
status | string | 'ok'

```
const json = new ECJsonStorage(process.env.JSONAPI, process.env.JSONSEC);
const bin = 'c8ba8b1da99c';
const res = await json.deleteBin(bin);
if (res.status !== 'ok') 
  console.error(`Could not delete bin ${bin}, error=${<resError>statusText}.`);
```

In addition, you also may wanna consult the [TS types file](dist/index.d.ts).
