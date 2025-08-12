"use client";
import { useState } from "react";
import { Tiktoken } from "js-tiktoken";
import o200k_base from "js-tiktoken/ranks/o200k_base";

export default function Home() {
  const enc = new Tiktoken(o200k_base);

  const [text, setText] = useState("");
  const [tokens, setTokens] = useState([]);
  const [embedding, setEmbedding] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEncode = async () => {
    try {
      setLoading(true);
      const tokenArr = enc.encode(text);
      setTokens(tokenArr);

      // Call API route to get embedding
      const res = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setEmbedding(data);
    } catch (err) {
      console.error("Encoding error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecode = () => {
    try {
      const arr = tokenInput
        .split(",")
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      const decoded = enc.decode(arr);
      setDecodedText(decoded);
    } catch (err) {
      console.error("Decoding error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold">Token Encoder + Embeddings</h1>

      {/* First Input */}
      <div>
        <label className="block font-semibold mb-2">Enter Text</label>
        <input
          className="border rounded p-2 w-full"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleEncode}
          disabled={loading}
        >
          {loading ? "Processing..." : "Get Tokens + Embedding"}
        </button>

        {tokens.length > 0 && (
          <div className="mt-2 p-2 bg-gray-100 rounded break-words">
            <strong>Tokens:</strong> {tokens.join(", ")}
          </div>
        )}

        {embedding && (
          <div className="mt-2 p-2 bg-gray-100 rounded break-words">
            <strong>Embedding Length:</strong> {embedding.length}
            <br />
            <strong>First 5 Values:</strong>{" "}
            {embedding.embedding.slice(0, 5).join(", ")}...
          </div>
        )}
      </div>

      {/* Second Input */}
      <div>
        <label className="block font-semibold mb-2">
          Enter Tokens (comma separated)
        </label>
        <input
          className="border rounded p-2 w-full"
          type="text"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleDecode}
        >
          Decode Tokens
        </button>

        {decodedText && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <strong>Decoded Text:</strong> {decodedText}
          </div>
        )}
      </div>
    </div>
  );
}
