import React from "react";

const Navigation = ({ videoUrl, setVideoUrl, handleVideoSubmit }) => {
  return (
    <div className=" flex justify-center h-[70px] bg-slate-500">
      <form>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
          className="mt-[20px] w-[600px] p-1 rounded-sm"
        />
        <button
          type="button"
          className=" bg-blue-300 p-1 rounded-br rounded-tr w-[80px]"
          onClick={handleVideoSubmit}
        >
          Submits
        </button>
      </form>
    </div>
  );
};

export default Navigation;
