import React from "react";
import { Link } from "react-router-dom";
React;

const CreateRoom = () => {
  return (
    <div className=" bg-slate-400 flex w-96 h-52 items-center mx-auto rounded-lg flex-col place-content-center ">
      Rooms
      <div className=" bg-slate-300 w-30 hover:shadow-xl rounded-md p-1 cursor-pointer">
        <Link to="/newroom">
          <span>create room</span>
        </Link>
      </div>
    </div>
  );
};

export default CreateRoom;
