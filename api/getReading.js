// File: /api/getReading.js
export default async function handler(request, response) {
    // Cho phép CORS để tránh lỗi chặn từ trình duyệt
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return response.status(500).json({ error: 'API key missing' });

    try {
        const { contents, generationConfig } = request.body;
        // Dùng flash model để nhanh và rẻ hơn, hoặc đổi sang gemini-1.5-pro nếu cần thông minh hơn
        const modelName = "gemini-1.5-flash"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, generationConfig })
        });

        const result = await apiResponse.json();
        response.status(200).json(result);

    } catch (error) {
        console.error('Gemini API Error:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}
