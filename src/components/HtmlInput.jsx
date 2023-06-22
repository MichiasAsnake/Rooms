import React from "react";

const HtmlInput = () => {
  return (
    <div>
      {" "}
      <form>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
        />
        <button
          type="button"
          className=" bg-blue-200"
          onClick={handleVideoSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default HtmlInput;
