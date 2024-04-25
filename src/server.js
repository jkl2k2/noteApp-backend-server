const { app } = require('./app');
require('../src/database')();

app.listen(8080, () => {
    useTestDB(false);

    console.log('\x1b[36m%s\x1b[0m', `
┌────────────────────────────────┐
│                                │
│ Server is running on port 8080 │
│                                │
└────────────────────────────────┘`);
});
