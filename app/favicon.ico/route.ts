import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to favicon in public directory
    const filePath = path.join(process.cwd(), 'public', 'favicon.ico');
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Return the favicon with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving favicon:', error);
    return new NextResponse(null, { status: 404 });
  }
} 