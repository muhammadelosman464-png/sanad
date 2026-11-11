import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const BACKEND_URL = process.env.SMART_REVIEW_BACKEND_URL || "https://smart-review-responder.onrender.com";
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || "AboIlyas_Auto_Secure_2026!@";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jfcjfrnsyhvfvdxcmket.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_4hiSEGbEmsOoa5-7sxx9IQ_ZnXQJy9D";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/customer_reviews?select=*&order=created_at.desc&limit=${limit}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ success: false, reviews: [] }, { status: 200 });
    }

    const reviews = await res.json();
    return NextResponse.json({ success: true, reviews });
  } catch {
    return NextResponse.json({ success: false, reviews: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customer_name = (body.customer_name || body.name || body.user_name || "").trim();
    const rating = Number(body.rating) || 5;
    const review_text = (body.review_text || body.review || body.comment || "").trim();
    const service_name = body.service_name || body.service_title || "";

    if (!customer_name || !review_text) {
      return NextResponse.json(
        { success: false, message: "يرجى كتابة الاسم والتقييم بشكل كامل." },
        { status: 400 }
      );
    }

    const payload = { customer_name, rating, review_text };

    // 1. Try calling the external Smart Review Responder backend
    const endpointsToTry = [
      `${BACKEND_URL}/process-review`,
      `${BACKEND_URL}/generate_reply`,
      "https://smart-review-responder.onrender.com/process-review",
      "https://smart-review-responder.onrender.com/generate_reply",
    ];

    let backendData: any = null;

    for (const endpoint of endpointsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Internal-Secret": INTERNAL_SECRET,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          if (json && (json.data || json.reply || json.ai_reply)) {
            backendData = json.data || json;
            break;
          }
        }
      } catch {
        continue;
      }
    }

    // 2. If backend succeeded, return the response
    if (backendData) {
      return NextResponse.json({
        success: true,
        message: "تم حفظ التقييم وتوليد الرد الذكي بنجاح",
        data: {
          id: backendData.id || `rev-${Date.now()}`,
          customer_name,
          rating,
          review_text,
          ai_reply: backendData.ai_reply || backendData.reply || "",
          status: backendData.status || (rating >= 4 ? "positive" : "negative"),
          created_at: backendData.created_at || new Date().toISOString(),
          service_name,
        },
      });
    }

    // 3. Fallback: Generate intelligent reply via Gemini directly if Render backend was unreachable/sleeping
    let aiReply = "";
    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `أنت ممثل خدمة العملاء وإدارة منصة "سَنَد" (Sanad Care Platform) لخدمات الدعم الأسري والرعاية.
قم بكتابة رد ذكي، لبق وودود جداً على تقييم العميل التالي:
- اسم العميل: ${customer_name}
- التقييم بالنجوم: ${rating} من 5
- الخدمة: ${service_name || "خدمات سَنَد"}
- نص التقييم: "${review_text}"

التعليمات:
1. خاطب العميل باسمه بلباقة وتقدير (مثلاً: أهلاً بك أستاذ ${customer_name}، أو مرحباً بكِ أستاذة ${customer_name}).
2. إذا كان التقييم إيجابياً (4-5 نجوم): اشكره بحرارة وعبّر عن سعادة فريق سَنَد بخدمته وتأكيد استمرار جودة الدعم.
3. إذا كان التقييم منخفضاً (1-3 نجوم): اعتذر بصدق واعرض المساعدة الفورية لمتابعة طلبه وتصحيح أي قصور.
4. استخدم لغة عربية فصحى معاصرة وأنيقة وموجزة (فقرة واحدة متناسقة من 2-4 جمل).
5. اكتب نص الرد فقط دون أي مقدمات أو علامات إضافية.`;

        const result = await model.generateContent(prompt);
        aiReply = result.response.text().trim();
      } catch (e) {
        console.warn("Direct Gemini fallback failed:", e);
      }
    }

    if (!aiReply) {
      aiReply = rating >= 4
        ? `أهلاً بك أستاذ ${customer_name}، يسعدنا جداً في منصة سَنَد أن نكون دائماً عند حسن ظنكم. رضاكم هو هدفنا الأول ونسعد دائماً بخدمتكم وتوفير أفضل تجربة دعم لعائلتكم!`
        : `أهلاً بك أستاذ ${customer_name}، نعتذر بصدق عن أي تجربة لم ترقَ لتطلعاتكم. فريق الدعم الفني في منصة سَنَد حريص على متابعة ملاحظتكم والعمل فوراً على تلافيها وتقديم الدعم بأعلى جودة.`;
    }

    // Save review to Supabase
    const fallbackRecord = {
      customer_name,
      rating,
      review_text,
      ai_reply: aiReply,
      status: rating >= 4 ? "positive" : "negative",
      created_at: new Date().toISOString(),
    };

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/customer_reviews`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(fallbackRecord),
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "تم حفظ التقييم وتوليد الرد الذكي بنجاح",
      data: {
        id: `rev-${Date.now()}`,
        ...fallbackRecord,
        service_name,
      },
    });
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ غير متوقع أثناء معالجة التقييم" },
      { status: 500 }
    );
  }
}
