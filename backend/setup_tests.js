var JasmineReporters = require('jasmine-reporters');
jasmine.getEnv().addReporter(
  new JasmineReporters.JUnitXmlReporter({
    savePath: 'test-reports',
    consolidateAll: false
  })
);
