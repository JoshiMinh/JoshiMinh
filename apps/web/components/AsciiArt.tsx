export function AsciiArt() {
  return (
    <pre
      className="text-[10px] md:text-xs text-accent/30 font-mono leading-none select-none overflow-auto mb-8 hidden md:block"
      aria-hidden="true"
    >
      {`
     _           _     _   __  __ _       _     
    | | ___  ___| |__ (_) |  \\/  (_)_ __ | |__  
 _  | |/ _ \\/ __| '_ \\| | | |\\/| | | '_ \\| '_ \\ 
| |_| | (_) \\__ \\ | | | | | |  | | | | | | | | |
 \\___/ \\___/|___/_| |_|_| |_|  |_|_|_| |_|_| |_|
                                                  
      `}
    </pre>
  );
}
