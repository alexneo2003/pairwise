import { pict } from 'pict-pairwise-testing';
import excel from 'exceljs';

class PairwiseService {
  pairwise(req) {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Pairwise');
    this.model = {
      parameters: [
        { property: 'Name', values: ['Alex', 'Jhon'] },
        { property: 'Surename', values: ['Neo', 'Dou'] },
        { property: 'Age', values: [36, 20] },
      ],
      constraints: ['IF [Name] = "Alex"   THEN [Age] = 36;', 'IF [Name] = "Alex"   THEN [Surename] = "Neo";'],
    };

    const result = pict(this.model, {
      options: {
        // show_model_statistics: true,
        // randomize_generation: 10,
        // order_of_combinations: 2,
      },
    });
    console.log(JSON.stringify(result, null, 2));

    function generateHeaders(value) {
      const headers = [];
      Object.keys(value).forEach((key) => {
        headers.push({ header: key, key, width: 15 });
      });
      return headers;
    }

    worksheet.columns = result.testCases.length > 0 && generateHeaders(result.testCases[0]);
    worksheet.addRows(result.testCases);

    return workbook;
  }
}

export default new PairwiseService();
