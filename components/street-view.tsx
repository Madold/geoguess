import { useRef, useEffect } from "react";
import { Viewer } from "mapillary-js";
import "mapillary-js/dist/mapillary.css";

export const StreetView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const viewerInstance = new Viewer({
        accessToken: "MLY|24230513883289720|3e0dd11050794b7d7ac5847fd26478bd",
        container: containerRef.current,
        imageId: "498763468214164",
      });

      viewerRef.current = viewerInstance;

      return () => {
        if (viewerRef.current) {
          viewerRef.current.remove();
          viewerRef.current = null;
        }
      };
    }
  }, []);

  return <div ref={containerRef} className="w-full h-[600px]"></div>;
};
