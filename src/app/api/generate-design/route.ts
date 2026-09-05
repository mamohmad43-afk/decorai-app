import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stylePrompt } = body;

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "المفتاح غير موجود في إعدادات Vercel" }, { status: 500 });
    }

    // استدعاء مباشر للنموذج مع ضمان استقبال النتيجة كصورة
    const apiResponse = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: stylePrompt || "Modern interior design living room",
          options: { wait_for_model: true }
        }),
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return NextResponse.json({ success: false, error: `خطأ من هักينغ فايس: ${errorText}` }, { status: 500 });
    }

    const buffer = await apiResponse.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    
    // التأكد من أن الناتج صورة وليس رسالة خطأ بنص JSON
    if (base64Image.length < 100) {
      return NextResponse.json({ success: false, error: "الرد ليس صورة صالحة، يرجى المحاولة لاحقاً" }, { status: 500 });
    }

    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      images: [{ url: imageUrl }]
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: `خطأ اتصال: ${err.message}` }, { status: 500 });
  }
}
