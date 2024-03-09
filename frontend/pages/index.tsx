import { useEffect } from "react";

export default function Home() {
  return (
    <div className="youtube">
      <iframe
        className="screen"
        src="https://www.youtube.com/embed/cbuZfY2S2UQ?start=0&mute=1&autoplay=1&rel=0&controls=0&showinfo=0"
        title="YouTube video player"
        allow="autoplay; encrypted-media;"
      ></iframe>
      <style jsx>
        {`
          .youtube {
            pointer-events: none;
          }
          .youtube .screen {
            border: none;
            height: 100vh;
            width: 100%;
            margin-top: -60px;
            margin-bottom: -50px;
          }
        `}
      </style>
    </div>
  );
}
