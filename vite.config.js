export default {
  cacheDir: '.vite-civicflow-cache',
  optimizeDeps: {
    include: ['react', 'react-dom/client', 'lucide-react']
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true
  }
};
