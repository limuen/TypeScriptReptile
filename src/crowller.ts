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
import cheerio from 'cheerio';

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[];
}

class Crowller {
  private secret = 'x3b174jsx';
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;

  // 获取课程信息
  async getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItem = $('.course-item');
    const coreseInfos: Course[] = [];
    courseItem.map((index, el) => {
      const descs = $(el).find('.course-desc');
      // 获取标题
      const title = descs.eq(0).text();
      // 获取学习人数
      const count = parseInt(
        descs
          .eq(1)
          .text()
          .split('：')[1],
        10
      );
      // 拿到数据以后push到数组里面
      coreseInfos.push({ title, count });
    });
    return {
      time: new Date().getTime(),
      data: coreseInfos,
    };
  }
  // 获取网址的html
  async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  // 生成JSON
  generateJsonContent(courseInfo: CourseResult) {
    const filePath = path.resolve(__dirname, '../data/course.json');

    let fileContent: Content = {};
    // 判断course.json是否存在
    if (fs.existsSync(filePath)) {
      // 如果有内容 直接读取内容
      // fs.readFileSync(filePath, 'utf-8')是字符串 interface是对象
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  async initSpiderProcess() {
    const filePath = path.resolve(__dirname, '../data/course.json');
    const html = await this.getRawHtml();
    const courseInfo = await this.getCourseInfo(html);
    const fileContent = await this.generateJsonContent(courseInfo);
    // fs.writeFileSync第二个参数必须是字符串 fileContent是对象 所以stringify
    fs.writeFileSync(filePath, JSON.stringify(fileContent));
    console.log(courseInfo, 'courseInfo');
  }

  constructor() {
    this.initSpiderProcess();
  }
}

const crowller = new Crowller();
