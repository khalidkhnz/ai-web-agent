// Test script for streaming API
async function testStreamingAPI() {
  console.log("🧪 Testing Streaming API...\n");

  try {
    // Test 1: Regular REST API
    console.log("1. Testing regular REST API:");
    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Hello, how are you?",
      }),
    });

    const data = await response.json();
    console.log("Response:", data.response);
    console.log("Streaming:", data.streaming);
    console.log("");

    // Test 2: Streaming API with Server-Sent Events
    console.log("2. Testing streaming API:");
    console.log("Sending: 'Tell me about artificial intelligence'");
    console.log("Streaming response:");

    const streamResponse = await fetch(
      "http://localhost:3001/api/chat/stream",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Tell me about artificial intelligence",
        }),
      }
    );

    const reader = streamResponse.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "start") {
              console.log("🚀 Stream started");
            } else if (data.type === "chunk") {
              process.stdout.write(data.chunk);
              fullMessage += data.chunk;
            } else if (data.type === "end") {
              console.log("\n✅ Stream ended");
            } else if (data.type === "error") {
              console.log("\n❌ Error:", data.message);
            }
          } catch (e) {
            // Ignore parsing errors for incomplete JSON
          }
        }
      }
    }

    console.log("\nFull message:", fullMessage);
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testStreamingAPI();
