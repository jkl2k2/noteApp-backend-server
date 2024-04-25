const { app } = require('./app');

app.listen(8080, () => {
    console.log('\x1b[36m%s\x1b[0m', `
┌────────────────────────────────┐
│                                │
│ Server is running on port 8080 │
│                                │
└────────────────────────────────┘`);
});
