export const modelData = {
  models: [
    {
      logo: "https://freeimghost.net/images/2025/04/30/openai.png",
      name: "GPT",
      output_type: "text",
      parameters: {
        api_key: "",
        endpoint: "",
        max_tokens: {
          default: 1000,
          max: 4096,
          min: 1,
        },
        model: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
        prompt: "",
        temperature: {
          default: 0.7,
          max: 2,
          min: 0,
        },
      },
      provider: "OpenAI",
    },
    {
      logo: "https://freeimghost.net/images/2025/04/30/dalle.jpeg",
      name: "DALL-E",
      output_type: "image",
      parameters: {
        api_key: "",
        endpoint: "",
        n: {
          default: 1,
          max: 10,
          min: 1,
        },
        prompt: "",
        quality: ["standard", "hd"],
        size: ["256x256", "512x512", "1024x1024", "1024x1792", "1792x1024"],
        style: ["vivid", "natural"],
      },
      provider: "OpenAI",
    },
    {
      logo: "https://freeimghost.net/images/2025/04/30/elevenlabs.png",
      name: "ElevenLabs",
      output_type: "voice",
      parameters: {
        api_key: "",
        endpoint: "",
        model: ["eleven_monolingual_v2", "eleven_multilingual_v2"],
        output_format: ["mp3_44100", "pcm_16000", "pcm_22050", "pcm_24000"],
        similarity_boost: {
          default: 0.5,
          max: 1,
          min: 0,
        },
        stability: {
          default: 0.5,
          max: 1,
          min: 0,
        },
        text: "TEXT_TO_SPEAK",
      },
      provider: "ElevenLabs",
    },
    {
      logo: "https://freeimghost.net/images/2025/04/30/runway.webp",
      name: "Runway",
      output_type: ["image", "video"],
      parameters: {
        api_key: "",
        endpoint: "",
        guidance_scale: {
          default: 7.5,
          max: 20,
          min: 1,
        },
        height: {
          default: 512,
          max: 2048,
          min: 256,
        },
        model: [
          "stable-diffusion-v1-5",
          "image-to-image",
          "text-to-image",
          "text-to-video",
          "image-to-video",
        ],
        seed: {
          max: 4294967295,
          min: 0,
        },
        width: {
          default: 512,
          max: 2048,
          min: 256,
        },
      },
      provider: "Runway ML",
    },
    {
      logo: "https://freeimghost.net/images/2025/04/30/midjourney.png",
      name: "Midjourney v7",
      output_type: "image",
      parameters: {
        api_key: "",
        aspect_ratio: ["1:1", "5:4", "4:3", "3:2", "16:9", "2:3", "9:16"],
        chaos: {
          default: 0,
          max: 100,
          min: 0,
        },
        endpoint: "",
        prompt: "IMAGE_DESCRIPTION",
        quality: [".25", ".5", "1", "2"],
        style: ["4a", "4b", "4c", "raw"],
        stylize: {
          default: 100,
          max: 1000,
          min: 0,
        },
      },
      provider: "Midjourney",
    },
  ],
};
