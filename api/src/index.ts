let count = 0;
setInterval(() => {
  process.stdout.write(`\rProcessing ${count++}\t`);
}, 1000);
