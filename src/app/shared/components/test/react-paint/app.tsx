import { Tldraw, useFileSystem } from "@tldraw/tldraw";
import { useMultiplayerState } from "./hooks/useMultiplayerState";
import "./styles.css";
import { roomID } from "src/store";
import { useInjector } from "./ngContext";
import { ActivatedRoute } from "@angular/router";

function Editor({ roomId }: { roomId: string }) {
  const fileSystemEvents = useFileSystem();
  const { onMount, ...events } = useMultiplayerState(roomId);

  return (
    <Tldraw
      autofocus
      disableAssets
      showPages={false}
      onMount={onMount}
      {...fileSystemEvents}
      {...events}
    />
  );
}

export default function App() {
  const injector = useInjector();

  console.log(injector.get(ActivatedRoute).url);

  
  return (
    <div className="tldraw">
      <Editor roomId={roomID} />
    </div>
  );
}
