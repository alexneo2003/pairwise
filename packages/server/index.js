const express = require('express');
const pict = require('pict-pairwise-testing').pict;

const app = express();

// const modelWithConstraints = {
//   parameters: [
//     { property: 'Size', values: [10, 100, 500, 1000, 5000, 10000, 40000] },
//     { property: 'Format method', values: ['quick', 'slow'] },
//     { property: 'File system', values: ['FAT', 'FAT32', 'NTFS'] },
//     {
//       property: 'Cluster size',
//       values: [512, 1024, 2048, 4096, 8192, 16384, 32768, 65536],
//     },
//     { property: 'Compression', values: ['on', 'off'] },
//   ],
//   constraints: [
//     'IF [File system] = "FAT"   THEN [Size] <= 4096;',
//     'IF [File system] = "FAT32" THEN [Size] <= 32000;',
//   ],
// };

// let result = pict(modelWithConstraints);

// const modelWithSubmodel = {
//   parameters: [
//     { property: 'PLATFORM', values: ['x86', 'x64', 'arm'] },
//     { property: 'CPUS', values: [1, 2, 4] },
//     { property: 'RAM', values: ['1GB', '4GB', '64GB'] },
//     { property: 'HDD', values: ['SCSI', 'IDE'] },
//     { property: 'OS', values: ['Win7', 'Win8', 'Win10'] },
//     { property: 'Browser', values: ['Edge', 'Opera', 'Chrome', 'Firefox'] },
//     { property: 'APP', values: ['Word', 'Excel', 'Powerpoint'] },
//   ],
//   submodels: ['{ PLATFORM, CPUS, RAM, HDD } @ 3', '{ OS, Browser } @ 2'],
// };

// let result = pict(modelWithSubmodel);

function pairwise() {
  const model = {
    parameters: [
      { property: 'Name', values: ['Alex', 'Jhon'] },
      { property: 'Surename', values: ['Neo', 'Dou'] },
      { property: 'Age', values: [36, 20] },
    ],
    constraints: [
      'IF [Name] = "Alex"   THEN [Age] = 36;',
      'IF [Name] = "Alex"   THEN [Surename] = "Neo";',
    ],
  };

  let result = pict(model, {
    options: {
      // show_model_statistics: true,
      // randomize_generation: 10,
      // order_of_combinations: 2,
    },
  });
  console.log(JSON.stringify(result, null, 2));
}

app.listen(3030, () => {
  console.log('server started at http://localhost:3030');

  pairwise();
});
