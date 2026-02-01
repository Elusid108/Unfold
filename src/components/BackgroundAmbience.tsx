export function BackgroundAmbience() {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-deck-shadow-from rounded-full blur-[120px]" />
    </div>
  );
}
