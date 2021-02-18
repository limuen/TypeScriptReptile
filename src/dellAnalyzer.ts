// 文件
import fs from 'fs';
import cheerio from 'cheerio';
import Analyze from './crowller';
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

export default class DellAnalyzer implements Analyze {
  private static instance: DellAnalyzer;

  static getInstance() {
    if (!DellAnalyzer.instance) {
      DellAnalyzer.instance = new DellAnalyzer();
    }

    return DellAnalyzer.instance;
  }

  // 获取课程信息
  private getCourseInfo(html: string) {
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

  // 生成JSON
  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    // const filePath = path.resolve(__dirname, '../data/course.json');

    let fileContent: Content = {};
    // 判断course.json是否存在
    if (fs.existsSync(filePath)) {
      // 如果有内容 直接读取内容
      // fs.readFileSync(filePath, 'utf-8')是字符串 interface是对象
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    // 把新爬的内容放到fileContent里面
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    console.log(courseInfo, 'courseInfo');
    // 把数据取出来
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private constructor() {}
}
