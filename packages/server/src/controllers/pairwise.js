import PairwiseService from '../services/pairwise';

class PairwiseController {
  getPairwise(req, res) {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=pairwise.xlsx');
    PairwiseService.pairwise(req)
      .xlsx.write(res)
      .then(() => {
        res.status(200).end();
      });
  }
}

export default new PairwiseController();
