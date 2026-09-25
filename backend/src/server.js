import app from './app.js';
import connectDB from './config/db.js';

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Interview PrepBridge AI Backend Running`);
  console.log(`📡 Server Port: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================`);
});
