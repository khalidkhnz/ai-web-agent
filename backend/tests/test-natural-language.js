// Test script for natural language interaction
async function testNaturalLanguage() {
  console.log("🗣️ Testing Natural Language Interaction...\n");

  const testMessages = [
    "Hello! What can you help me with?",
    "take me to the dashboard",
    "show me a success message",
    "open a modal",
    "go to my profile",
    "display a warning notification",
    "refresh the data",
  ];

  for (const message of testMessages) {
    console.log(`\n👤 User: "${message}"`);
    process.stdout.write("🤖 Agent: ");

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      console.log(data.response);

      // Wait a bit between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log("❌ Error:", error.message);
    }
  }
}

// Run the test
testNaturalLanguage();
