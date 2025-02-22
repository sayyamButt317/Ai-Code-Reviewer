import "./App.css";
import { useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { Copy } from "lucide-react";
function App() {
  const [code, setCode] = useState(``);
  const [review, setReview] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy");

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(review); 
      setCopyStatus(copyStatus,"Copied!"); 
      setTimeout(() => setCopyStatus("Copy"), 1000); 
    } catch (err) {
      setCopyStatus("Failed to Copy", err.message); 
      setTimeout(() => setCopyStatus("Copy"), 2000); 
    }
  };
  async function CodeReview() {
    setReview("Reviewing...");

    try {
      const response = await axios.post("http://localhost:8000/get-review", {
        code,
      });
      setReview(response.data.response);
    } catch (error) {
      setReview(
        `Error fetching review: ${
          error.message || "Unknown error"
        }. Please try again.`
      );
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) => {
                const highlighted = prism.highlight(
                  code,
                  prism.languages.javascript,
                  "javascript"
                );

                // Add line numbers
                return highlighted
                  .split("\n")
                  .map(
                    (line, i) =>
                      `<span class="line-number">${i + 1}</span> ${line}`
                  )
                  .join("\n");
              }}
              padding={15}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: "16px",
                backgroundColor: "#0c0c0c",
                color: "#ffffff",
                borderRadius: "5px",  
                height: "100%",
                width: "100%",
                overflow: "auto",
                lineHeight: "1.5",
                
              }}
            />
          </div>
          <div onClick={CodeReview} className="review">
            Review
          </div>
        </div>
        <div className="right">
          <button className="copy">
            <Copy onClick={handleCopyClick} />
          </button>
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
