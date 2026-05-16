#!/bin/bash

# FRA Platform - Dual Server Start Script
# Runs both backend (port 4000) and frontend (port 3000) in parallel

echo "🚀 Starting FRA Digital Platform..."
echo ""

# Start backend in background
echo "📡 Starting backend server on port 4000..."
npm run dev:server &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend 
echo "🎨 Starting frontend dev server on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
