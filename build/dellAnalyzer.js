"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 文件
var fs_1 = __importDefault(require("fs"));
var cheerio_1 = __importDefault(require("cheerio"));
var DellAnalyzer = /** @class */ (function () {
    function DellAnalyzer() {
    }
    DellAnalyzer.getInstance = function () {
        if (!DellAnalyzer.instance) {
            DellAnalyzer.instance = new DellAnalyzer();
        }
        return DellAnalyzer.instance;
    };
    // 获取课程信息
    DellAnalyzer.prototype.getCourseInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var courseItem = $('.course-item');
        var coreseInfos = [];
        courseItem.map(function (index, el) {
            var descs = $(el).find('.course-desc');
            // 获取标题
            var title = descs.eq(0).text();
            // 获取学习人数
            var count = parseInt(descs
                .eq(1)
                .text()
                .split('：')[1], 10);
            // 拿到数据以后push到数组里面
            coreseInfos.push({ title: title, count: count });
        });
        return {
            time: new Date().getTime(),
            data: coreseInfos,
        };
    };
    // 生成JSON
    DellAnalyzer.prototype.generateJsonContent = function (courseInfo, filePath) {
        // const filePath = path.resolve(__dirname, '../data/course.json');
        var fileContent = {};
        // 判断course.json是否存在
        if (fs_1.default.existsSync(filePath)) {
            // 如果有内容 直接读取内容
            // fs.readFileSync(filePath, 'utf-8')是字符串 interface是对象
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        // 把新爬的内容放到fileContent里面
        fileContent[courseInfo.time] = courseInfo.data;
        return fileContent;
    };
    DellAnalyzer.prototype.analyze = function (html, filePath) {
        var courseInfo = this.getCourseInfo(html);
        console.log(courseInfo, 'courseInfo');
        // 把数据取出来
        var fileContent = this.generateJsonContent(courseInfo, filePath);
        return JSON.stringify(fileContent);
    };
    return DellAnalyzer;
}());
exports.default = DellAnalyzer;
