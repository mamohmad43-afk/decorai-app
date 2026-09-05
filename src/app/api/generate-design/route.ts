import { NextResponse } from 'next/server';

// هذا السطر يمنع Vercel من قطع الاتصال ويسمح للطلب بالعمل لمدة 60 ثانية
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stylePrompt } = body;

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "المفتاح السري غير موجود في Vercel" }, { status: 500 });
    }

    // استبدلنا النموذج بنموذج أسرع وأكثر استقراراً لمنع أخطاء التحميل
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        headers: {
          Authorization: `Bearer ` + apiKey,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `Interior design, ${stylePrompt || "modern living room"}, photorealistic, 4k`,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ success: false, error: `Hugging Face Error: ${errText}` }, { status: 500 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
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
