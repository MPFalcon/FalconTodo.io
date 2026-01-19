import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const host = 'localhost';
  const port = '3000';

  try {
    // Read formData
    const formData = await req.formData();
    const file = formData.get('media'); // must match input name="media"

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // In Next.js 13 Edge: file is a File object, use .stream() or .arrayBuffer()
    // In Node runtime: file might be a Blob with .stream()
    const arrayBuffer = await file.arrayBuffer(); // works in Node 18+ / modern Next.js runtime
    const buffer = Buffer.from(arrayBuffer);

    // Save to local directory
    const uploadDir = path.join(process.cwd(), 'src/app/uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, path: 'http://'+host+':'+port+'/uploads/'+file.name }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// EOF
