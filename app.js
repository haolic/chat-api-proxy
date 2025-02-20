const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// 验证必要的环境变量
if (!process.env.API_KEY) {
  console.error('错误: 缺少必要的环境变量 API_KEY');
  process.exit(1);
}

const port = process.env.PORT || 3123;

// 添加 CORS 中间件
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const messages = [
      {
        role: "user",
        content: "所有route\\routes都翻译为路由"
      },
      ...(req.body.messages || [])
    ];

    console.log(messages);

    const requestBody = {
      model: process.env.MODEL,
      messages: messages,
      "response_format": { "type": "text" }
    };

    const response = await axios.post(
      process.env.SERVICE_URL,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_KEY}`
        }
      }
    );
    // 输出一下response.data的usage
    console.log(process.env.SERVICE_URL, response.data.usage);
    res.json(response.data);
  } catch (error) {
    const errorResponse = {
      error: error.message,
      details: error.response?.data || '未知错误',
      status: error.response?.status || 500
    };
    console.log(error.response.data);

    res.status(errorResponse.status).json(errorResponse);
  }
});

console.log('当前环境变量:', {
  PORT: process.env.PORT,
  API_KEY: process.env.API_KEY ? '已设置' : '未设置'
});

app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
}); 