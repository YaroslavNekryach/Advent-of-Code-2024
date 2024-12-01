import * as http from 'node:https';

const session = '';
const year = 2024

export function getInput(day: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      host: 'adventofcode.com',
      path: `/${year}/day/${day}/input`,
      headers: {Cookie: `session=${session}`}
    };

    const req = http.request(options, function(response) {
      let str = '';

      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        if (str.charAt(str.length - 1) === '\n') {
          str = str.slice(0, -1);
        }
        resolve(str);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  })
}

export function sendAnswer(day: number, level: number, anwer: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      host: 'adventofcode.com',
      path: `/${year}/day/${day}/answer`,
      method: 'POST',
      headers: {
        Cookie: `session=${session}`,
        'content-type': 'application/x-www-form-urlencoded'
      }
    };

    const req = http.request(options, function(response) {
      let str = '';

      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        if (str.charAt(str.length - 1) === '\n') {
          str = str.slice(0, -1);
        }
        resolve(str);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(`level=${level}&answer=${anwer}`)
    req.end();
  })
}


export function getTestFunction(call: (input: any) => any): (data: any, expected: any) => boolean {
  return (data: string, expected: any) => {
    const actual = call(data);
    if (actual === expected)
      console.log('\x1b[32mSuccess test\x1b[0m:\x1b[36m', data,'\x1b[32m', actual, '\x1b[0m');
    else
      console.log('\x1b[31mFail test\x1b[0m:\x1b[36m', data, '\x1b[0mexpected:\x1b[33m', expected, '\x1b[0mactual:\x1b[31m', actual);

    return actual == expected;
  }
}
