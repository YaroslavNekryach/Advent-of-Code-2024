import {run as day1Run} from './day1';
import {run as day2Run} from './day2';

async function runAll() {
  await day1Run()
  await day2Run()
}

runAll()
