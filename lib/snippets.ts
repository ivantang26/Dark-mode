/**
 * Code samples shown across the site. Each snippet has one entry per SDK language;
 * the selected language persists for the session (FR-1, lib/lang-store.ts).
 */
export const API_BASE = "https://api.synapse.example/v1";

export type SdkLang = "python" | "javascript" | "go" | "curl";

export const SDK_LANGS: { id: SdkLang; label: string; shiki: string }[] = [
  { id: "python", label: "Python", shiki: "python" },
  { id: "javascript", label: "JavaScript", shiki: "javascript" },
  { id: "go", label: "Go", shiki: "go" },
  { id: "curl", label: "cURL", shiki: "bash" },
];

export type Snippet = Record<SdkLang, string>;

export function firstCall(model = "syn-flash"): Snippet {
  return {
    python: `from synapse import Synapse

client = Synapse()  # reads SYNAPSE_API_KEY

stream = client.chat.create(
    model="${model}",
    messages=[{"role": "user", "content": "Explain latency in 8 words"}],
    stream=True,
)

for chunk in stream:
    print(chunk.delta, end="", flush=True)
`,
    javascript: `import Synapse from "@synapse/sdk";

const client = new Synapse(); // reads SYNAPSE_API_KEY

const stream = await client.chat.create({
  model: "${model}",
  messages: [{ role: "user", content: "Explain latency in 8 words" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta);
}
`,
    go: `package main

import (
	"context"
	"fmt"

	synapse "github.com/synapse-example/synapse-go"
)

func main() {
	client := synapse.NewClient() // reads SYNAPSE_API_KEY

	stream, err := client.Chat.Create(context.Background(), synapse.ChatRequest{
		Model:    "${model}",
		Messages: []synapse.Message{{Role: "user", Content: "Explain latency in 8 words"}},
		Stream:   true,
	})
	if err != nil {
		panic(err)
	}
	for chunk := range stream.Chunks() {
		fmt.Print(chunk.Delta)
	}
}
`,
    curl: `curl ${API_BASE}/chat \\
  -H "Authorization: Bearer $SYNAPSE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "stream": true,
    "messages": [{"role": "user", "content": "Explain latency in 8 words"}]
  }'
`,
  };
}

export const install: Snippet = {
  python: `pip install synapse-sdk`,
  javascript: `npm install @synapse/sdk`,
  go: `go get github.com/synapse-example/synapse-go`,
  curl: `# Nothing to install. Check curl is available:
curl --version`,
};

export const setKey: Snippet = {
  python: `export SYNAPSE_API_KEY="syn_live_..."`,
  javascript: `export SYNAPSE_API_KEY="syn_live_..."`,
  go: `export SYNAPSE_API_KEY="syn_live_..."`,
  curl: `export SYNAPSE_API_KEY="syn_live_..."`,
};

export const functionCalling: Snippet = {
  python: `tools = [{
    "name": "get_weather",
    "description": "Current weather for a city",
    "parameters": {"type": "object", "properties": {"city": {"type": "string"}}},
}]

reply = client.chat.create(model="syn-flash", messages=messages, tools=tools)

if reply.tool_calls:
    call = reply.tool_calls[0]
    print(call.name, call.arguments)  # get_weather {"city": "Lisbon"}
`,
  javascript: `const tools = [{
  name: "get_weather",
  description: "Current weather for a city",
  parameters: { type: "object", properties: { city: { type: "string" } } },
}];

const reply = await client.chat.create({ model: "syn-flash", messages, tools });

if (reply.toolCalls.length) {
  const call = reply.toolCalls[0];
  console.log(call.name, call.arguments); // get_weather {"city": "Lisbon"}
}
`,
  go: `tools := []synapse.Tool{{
	Name:        "get_weather",
	Description: "Current weather for a city",
	Parameters:  synapse.Schema{"type": "object", "properties": synapse.Schema{"city": synapse.Schema{"type": "string"}}},
}}

reply, _ := client.Chat.Create(ctx, synapse.ChatRequest{Model: "syn-flash", Messages: messages, Tools: tools})

for _, call := range reply.ToolCalls {
	fmt.Println(call.Name, call.Arguments) // get_weather {"city": "Lisbon"}
}
`,
  curl: `curl ${API_BASE}/chat \\
  -H "Authorization: Bearer $SYNAPSE_API_KEY" \\
  -d '{
    "model": "syn-flash",
    "messages": [{"role": "user", "content": "Weather in Lisbon?"}],
    "tools": [{"name": "get_weather", "parameters": {"type": "object",
      "properties": {"city": {"type": "string"}}}}]
  }'
`,
};
