import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stylePrompt } = body;

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "المفتاح السري غير موجود في Vercel" }, { status: 500 });
    }

    const hf = new HfInference(apiKey);

    const response = await hf.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: `Interior design, ${stylePrompt || "modern living room"}, photorealistic, 4k`,
      parameters: { num_inference_steps: 4 }
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Image = buffer.toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      images: [{ url: imageUrl }]
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
