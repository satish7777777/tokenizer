"use client";
import { useState } from "react";
import { Tiktoken } from "js-tiktoken";
import o200k_base from "js-tiktoken/ranks/o200k_base";

export default function Home() {
  const enc = new Tiktoken(o200k_base);

  const [text, setText] = useState("");
  const [tokens, setTokens] = useState([]);
  const [tokenInput, setTokenInput] = useState("");
  const [decodedText, setDecodedText] = useState("");

  const handleEncode = () => {
    try {
      const tokenArr = enc.encode(text);
      setTokens(tokenArr);
    } catch (err) {
      console.error("Encoding error:", err);
    }
  };

  const handleDecode = () => {
    try {
      // Convert "123,456,789" → [123,456,789]
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
      <h1 className="text-2xl font-bold">Token Encoder / Decoder</h1>

      {/* First Input (Text → Tokens) */}
      <div>
        <label className="block font-semibold mb-2">Enter Text</label>
        <input
          className="border rounded p-2 w-full"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
          onClick={handleEncode}
        >
          Get Tokens
        </button>

        {tokens.length > 0 && (
          <div className="mt-2 p-2 bg-gray-100 rounded break-words">
            <strong>Tokens:</strong> {tokens.join(", ")}
          </div>
        )}
      </div>

      {/* Second Input (Tokens → Text) */}
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
          className="mt-2 px-4 py-2 bg-blue-800 text-white rounded"
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
