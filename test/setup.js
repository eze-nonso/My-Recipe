import { umzugMigrate, umzugSeed } from './common';


// mocha is smart enough to run all
// code in all files outside of any describe
// blocks first before code inside describe blocks in all files
setup('Run seeds', function upSeed() {
  this.timeout(0);
  return umzugMigrate.executed()
    .then(executed =>
      (executed.length
        ? umzugMigrate.down({
          to: 0
        })
        : undefined))
    .then(() => umzugMigrate.up())
    .then(() =>
      umzugSeed.up());
});


teardown('Down seeds', function down() {
  this.timeout(0);
  return umzugMigrate.down({
    to: 0
  });
});
