// 文件
import fs from 'fs';
// 路径
import path from 'path';
// ts -> js 报错 解决方法
// ts -> d.ts 翻译文件 -> js
// npm i --save-dev @types/superagent
// 爬虫工具
import * as superagent from 'superagent';
// npm install cheerio --save   npm install @types/cheerio -D

import DellAnalyzer from './dellAnalyzer';
// import LeeAnalyzer from './leeAnalyzer';

// 参数html、filePath 返回也是string
export default interface Analyze {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/course.json');

  // 获取网址的html
  private async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  private writeFile(content: string) {
    // fs.writeFileSync第二个参数必须是字符串 fileContent是对象 所以stringify
    fs.writeFileSync(this.filePath, content);
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    // fs.writeFileSync第二个参数必须是字符串 fileContent是对象 所以stringify
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

  constructor(private url: string, private analyzer: Analyze) {
    this.initSpiderProcess();
  }
}
const secret = 'x3b174jsx';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
// 组合设计模式
// const url = 'http://www.baidu.com';
// 单例模式
const analyzer = DellAnalyzer.getInstance();
// 组合设计模式
// const analyzer = new DellAnalyzer();
// const leeAnalyzer = new LeeAnalyzer();
new Crowller(url, analyzer); 
