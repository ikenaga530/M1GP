import axios from "axios";

const API_URL = "https://api.openai.com/v1/";
const MODEL = "gpt-3.5-turbo";
const API_KEY = process.env.REACT_APP_CHAT;

export const chat = async (place, message) => {
  try {
    const response = await axios.post(
      `${API_URL}chat/completions`,
      {
        // モデル ID の指定
        model: MODEL,
        // 質問内容
        messages: [
          {
            role: "system",
            content: "あなたは今から、奈良県の地名を与えられます。",
          },
          {
            role: "system",
            content:
              "与えられた地名について、その場所のおすすめポイントなどを要約して教えてあげてください。",
          },
          {
            role: "user",
            content:
              "あなたに教えて欲しい観光地は奈良県の「" + place + "」です。",
          },
          {
            role: "user",
            content:
              "また、追加のユーザの質問が「" +
              message +
              "」です。これについても回答してください。messageが空の場合は無視して構いません。追加のユーザの質問がないため、以上ですは絶対に出力しないでください。おすすめの観光地についての出力と、追加のユーザの質問には改行を必ず入れてください。",
          },
        ],
      },
      {
        // 送信する HTTP ヘッダー(認証情報)
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    // 回答の取得
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return null;
  }
};
