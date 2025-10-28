import { useRef, useEffect } from "react";
import { Viewer } from "mapillary-js";
import "mapillary-js/dist/mapillary.css";

interface Props {
  imageId?: string;
}

export const StreetView = ({ imageId = "1004351301404983" }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (containerRef.current && imageId) {
      const viewerInstance = new Viewer({
        accessToken: process.env.NEXT_PUBLIC_MAPILLARY_TOKEN!,
        container: containerRef.current,
        imageId,
      });

      viewerRef.current = viewerInstance;

      return () => {
        if (viewerRef.current) {
          viewerRef.current.remove();
          viewerRef.current = null;
        }
      };
    }
  }, [imageId]);

  return <div ref={containerRef} className="w-full h-[600px]"></div>;
};
