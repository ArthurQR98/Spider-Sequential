// node spider-cli https://www.depor.pe 1
import { spider } from "./spider.js";

const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3], 10) || 1;

spider(url, nesting)
  .then(() => console.log(`Download complete`))
  .catch((err) => console.log(err));
