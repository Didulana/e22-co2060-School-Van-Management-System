import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import adminRoutes from './src/routes/adminRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running');
});

// Admin routes
app.use('/api/admin', adminRoutes);

// Global error fallback
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
