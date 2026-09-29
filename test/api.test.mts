import { expect, test } from 'vitest';
import {
  ECJsonStorage,
  type resGetBins,
  type resGetBin,
  type resCreateBin,
  type resUpdateBin,
  type resPatchBin
} from '../src/index';
import { config } from 'dotenv-safe';
config();

test('Rejects a constructor call with a missing Api-key', () => {
  expect(() => {
    const json = new ECJsonStorage('');
  }).toThrow('Invalid constructor params!');
});

test('Fixes an alternative Api URL if it has ending slash/es', () => {
  const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!, 'https://other.com/api////');
  expect(json.url).toBe('https://other.com/api');
});

test.only('Can construct a valid class', () => {
  const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!);
  expect(json.url).toBe('https://json.extendsclass.com/bin');
  expect(json.apiKey).toBe(process.env.JSONAPI);
  expect(json.securityKey).toBe(process.env.JSONSEC);
  expect(json.monthlyLimit).toBe(10000);
});

test('Can overwrite the API url if needed', () => {
  const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!, 'https://someotherapiurl.de');
  expect(json.url).toBe('https://someotherapiurl.de');
  expect(json.apiKey).toBe(process.env.JSONAPI);
  expect(json.securityKey).toBe(process.env.JSONSEC);
  expect(json.monthlyLimit).toBe(10000);
});

test('Can get all bins of an API Key', async () => {
  const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!);
  const res = await json.getBins();
  console.log(res);
  expect(res.status).toBe('ok');
  expect((res as resGetBins).callsDone).not.toBeNaN();
  expect((res as resGetBins).callsDone).toBeGreaterThan(0);
  expect((res as resGetBins).callsRemaining).not.toBeNaN();
  expect((res as resGetBins).callsRemaining).toBeGreaterThan(0);
  expect(Array.isArray((res as resGetBins).bins)).toBe(true);
  expect((res as resGetBins).bins!.length).toBeGreaterThanOrEqual(0);
});

test('Can get the current limit state', async () => {
  const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!);
  const res = await json.getStats();
  console.log(res);
  expect(res.status).toBe('ok');
  expect((res as resGetBins).callsDone).not.toBeNaN();
  expect((res as resGetBins).callsDone).toBeGreaterThan(0);
  expect((res as resGetBins).callsRemaining).not.toBeNaN();
  expect((res as resGetBins).callsRemaining).toBeGreaterThan(0);
});

test('Can get the content of a bin', async () => {
  const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!);
  const res = await json.getBin(process.env.JSONBIN!);
  console.log(res);
  expect(res.status).toBe('ok');
  expect(typeof (res as resGetBin).data).toBe('object');
  expect(Object.keys((res as resGetBin).data).length).toBe(2);
  expect(Object.keys((res as resGetBin).data)).toContain('name');
  expect(Object.keys((res as resGetBin).data)).toContain('profession');
});

test('Can create a new bin', async () => {
  const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!);
  const payload = { name: 'Neon', profession: 'IT-Consultant' };
  const res = await json.createBin(payload, true);
  console.log(res);
  expect(res.status).toBe('ok');
  expect(typeof (res as resCreateBin).uri).toBeTruthy();
  expect(typeof (res as resCreateBin).bin).toBeTruthy();
});

interface payloadData {
  name: string;
  profession: string;
}
test('Can update/change the content of a bin', async () => {
  const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!);
  const payload: payloadData = { name: 'NeonWilderness', profession: 'Web Ninja' };
  const res = await json.updateBin(payload, process.env.JSONBIN!);
  console.log(res);
  expect(res.status).toBe('ok');
  const dataParsed = JSON.parse((res as resUpdateBin).data);
  expect(Object.keys(dataParsed).length).toBe(2);
  expect(Object.keys(dataParsed)).toContain('name');
  expect(Object.keys(dataParsed)).toContain('profession');
  const { name, profession } = dataParsed as payloadData;
  expect(name).toBe(payload.name);
  expect(profession).toBe(payload.profession);
});

interface payloadPatched extends payloadData {
  added: string;
  times: number;
}
test('Can patch the content of a bin', async () => {
  const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!);
  const payloadAdd = { added: 'IT-Consulting', times: 999 };
  const res = await json.patchBin(payloadAdd, process.env.JSONBIN!);
  console.log(res);
  expect(res.status).toBe('ok');
  const data = JSON.parse((res as resPatchBin).data);
  expect(Object.keys(data).length).toBe(4);
  expect(Object.keys(data)).toContain('name');
  expect(Object.keys(data)).toContain('profession');
  expect(Object.keys(data)).toContain('added');
  expect(Object.keys(data)).toContain('times');
  const { name, profession, added, times } = data as payloadPatched;
  expect(name).toBe('NeonWilderness');
  expect(profession).toBe('Web Ninja');
  expect(added).toBe('IT-Consulting');
  expect(times).toBe(999);
});

test('Can delete a bin', async () => {
  const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!);
  const res1 = await json.createBin({ type: 'dummy' }, true);
  expect(res1.status).toBe('ok');
  const bin = (res1 as resCreateBin).bin;
  expect(bin).toBeTruthy();
  console.log(bin);
  const res2 = await json.deleteBin(bin);
  expect(res2.status).toBe('ok');
});
