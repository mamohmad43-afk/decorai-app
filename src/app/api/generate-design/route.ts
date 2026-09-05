import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stylePrompt } = body;

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "المفتاح السري غير موجود في إعدادات Vercel" }, { status: 500 });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: `Interior design, ${stylePrompt}, photorealistic, 8k` }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ success: false, error: `خطأ من الذكاء الاصطناعي: ${errText}` }, { status: 500 });
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      images: [{ url: imageUrl }]
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "حدث خطأ ما" }, { status: 500 });
  }
}
