import Analyze from './crowller';

export default class LeeAnalyzer implements Analyze {
  public analyze(html: string, filePath: string) {
    return html;
  }
}
