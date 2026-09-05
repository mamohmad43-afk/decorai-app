import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, room, style } = body;

    const apiKey = process.env.HUGGINGFACE_API_KEY;

    // محاولة الاتصال بـ Hugging Face
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        headers: {
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ 
          inputs: prompt || `Photorealistic interior design of a modern ${room || 'living room'}, ${style || 'minimalist'}, high-end furniture, 8k resolution` 
        }),
      }
    );

    // إذا نجح الاتصال واستقبلنا الصورة
    if (response.ok) {
      const imageBuffer = await response.arrayBuffer();
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });
    }

    // إذا فشل الاتصال من Hugging Face، نرجع صورة تصميم احترافية كبديل فوري
    console.warn("Hugging Face API failed, falling back to sample image.");
    return NextResponse.json({ 
      fallbackUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80" 
    });

  } catch (error: any) {
    // في حال حدث fetch failed أو أي خطأ شبكة، نرجع رابط الصورة البديلة مباشرة لتجنب توقف التطبيق
    return NextResponse.json({ 
      fallbackUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80" 
    });
  }
}
